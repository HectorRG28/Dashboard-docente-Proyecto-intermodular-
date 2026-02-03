// src/models/actividadesEvaluables.model.js
const pool = require('../db/pool');

// 1. OBTENER TODAS (GET)
// Adaptado para traer el color y nombre de la asignatura
const getAllActividadesEvaluables = async function () {
  const sql = `
    SELECT 
      ae.id_actividad, 
      ae.id_actividad, 
      ae.titulo, 
      ae.descripcion, 
      ae.aula,
      ae.fecha_inicio, 
      ae.fecha_fin, 
      ae.id_tipo,
      ae.id_estado,
      ae.creado_por,
      -- Datos extra útiles para el calendario
      asi.nombre as nombre_asignatura,
      asi.color as color_asignatura,
      u.nombre as nombre_docente,
      GROUP_CONCAT(dm.nombre SEPARATOR ', ') as nombres_menciones,
      GROUP_CONCAT(dm.id_usuario SEPARATOR ',') as ids_menciones
    FROM actividad_evaluable ae
    JOIN asignacion_docente ad ON ae.id_asignacion = ad.id_asignacion
    JOIN asignatura asi ON ad.id_asignatura = asi.id_asignatura
    JOIN usuario u ON ae.creado_por = u.id_usuario
    LEFT JOIN actividad_mencion am ON ae.id_actividad = am.id_actividad
    LEFT JOIN usuario dm ON am.id_docente = dm.id_usuario
    GROUP BY ae.id_actividad
    ORDER BY ae.fecha_inicio ASC
  `;
  
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

// 2. CREAR ACTIVIDAD (POST)
// Adaptado: Eliminados 'peso' e 'id_periodo'
const createActividadEvaluable = async function (datos) {
  const sql = `
    INSERT INTO actividad_evaluable 
    (titulo, descripcion, aula, fecha_inicio, fecha_fin, id_tipo, id_estado, id_asignacion, creado_por) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  try {
    const [result] = await pool.query(sql, [
      datos.titulo,
      datos.descripcion,
      datos.aula || null,
      datos.fecha_inicio ? new Date(datos.fecha_inicio) : null,
      datos.fecha_fin ? new Date(datos.fecha_fin) : null,
      datos.id_tipo,
      datos.id_estado,
      datos.id_asignacion,
      datos.creado_por
    ]);

    const idActividad = result.insertId;

    // GUARDAR MENCIONES
    if (datos.menciones && Array.isArray(datos.menciones) && datos.menciones.length > 0) {
      try {
        const sqlMenciones = 'INSERT INTO actividad_mencion (id_actividad, id_docente) VALUES ?';
        const values = datos.menciones.map(idDocente => [idActividad, idDocente]);
        await pool.query(sqlMenciones, [values]);
      } catch (errMencion) {
        console.error('Error insertando menciones:', errMencion);
        // No lanzamos error para no abortar la creación de la actividad, pero logueamos
      }
    }

    // Devolvemos el objeto creado con su nuevo ID
    return { id_actividad: idActividad, ...datos };
  } catch (error) {
    console.error('Error createActividadEvaluable:', error);
    throw error;
  }
};

// 3. OBTENER POR ID (Opcional, pero útil)
const getActividadEvaluableById = async function (id) {
  const sql = `SELECT * FROM actividad_evaluable WHERE id_actividad = ?`;
  const [rows] = await pool.query(sql, [id]);
  return rows[0];
};

// 4. BORRAR (DELETE)
const deleteActividadEvaluable = async function (id) {
  const sql = `DELETE FROM actividad_evaluable WHERE id_actividad = ?`;
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows > 0;
};

// 5. ACTUALIZAR (PUT)
const updateActividadEvaluable = async function (id, datos) {
  const sql = `
    UPDATE actividad_evaluable SET
      titulo = ?, descripcion = ?, aula = ?, fecha_inicio = ?, fecha_fin = ?,
      id_tipo = ?, id_estado = ?, id_asignacion = ?
    WHERE id_actividad = ?
  `;
  const [result] = await pool.query(sql, [
    datos.titulo, datos.descripcion, datos.aula || null, datos.fecha_inicio, datos.fecha_fin,
    datos.id_tipo, datos.id_estado, datos.id_asignacion, id
  ]);

  // ACTUALIZAR MENCIONES (Borrar e insertar nuevas)
  if (datos.menciones && Array.isArray(datos.menciones)) {
     // 1. Borrar anteriores
     await pool.query('DELETE FROM actividad_mencion WHERE id_actividad = ?', [id]);
     
     // 2. Insertar nuevas si hay
     if (datos.menciones.length > 0) {
        const sqlMenciones = 'INSERT INTO actividad_mencion (id_actividad, id_docente) VALUES ?';
        const values = datos.menciones.map(idDocente => [id, idDocente]);
        await pool.query(sqlMenciones, [values]);
     }
  }

  return result.affectedRows > 0 ? { id_actividad: id, ...datos } : null;
};

// 6. CHECK CONFLICTO AULA
const checkAulaConflict = async function (aula, fechaInicio, fechaFin, excludeId = null) {
  if (!aula) return false;

  let sql = `
    SELECT * FROM actividad_evaluable 
    WHERE aula = ? 
    AND fecha_inicio < ? 
    AND fecha_fin > ?
  `;
  
  const params = [aula, fechaFin, fechaInicio];

  if (excludeId) {
    sql += ' AND id_actividad != ?';
    params.push(excludeId);
  }

  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
};

// 7. GET AULAS DISPONIBLES
const getAvailableAulas = async function (fecha, horaInicio, horaFin) {
  // 1. Obtener aulas ocupadas
  const sqlOcupadas = `
    SELECT DISTINCT aula 
    FROM actividad_evaluable 
    WHERE aula IS NOT NULL 
    AND (
      (fecha_inicio < ? AND fecha_fin > ?)
    )
  `;
  // La lógica de coincidencia de fechas asume que 'fecha' ya está en fecha_inicio/fecha_fin
  // Pero necesitamos construir datetime completos para la comparación
  const inicio = `${fecha} ${horaInicio}:00`;
  const fin = `${fecha} ${horaFin}:00`;

  const [ocupadas] = await pool.query(sqlOcupadas, [fin, inicio]);
  const aulasOcupadas = ocupadas.map(row => row.aula);

  // 2. Obtener todas las aulas
  const [todas] = await pool.query('SELECT nombre FROM aulas');
  
  // 3. Filtrar
  return todas.filter(a => !aulasOcupadas.includes(a.nombre));
};

module.exports = {
  getAllActividadesEvaluables,
  createActividadEvaluable,
  getActividadEvaluableById,
  deleteActividadEvaluable,
  updateActividadEvaluable,
  checkAulaConflict,
  getAvailableAulas
};