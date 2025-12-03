// src/models/actividadesEvaluables.model.js
const pool = require('../db/pool');

// 1. OBTENER TODAS (GET)
// Adaptado para traer el color y nombre de la asignatura
const getAllActividadesEvaluables = async function () {
  const sql = `
    SELECT 
      ae.id_actividad, 
      ae.titulo, 
      ae.descripcion, 
      ae.fecha_inicio, 
      ae.fecha_fin, 
      ae.id_tipo,
      ae.id_estado,
      ae.creado_por,
      -- Datos extra útiles para el calendario
      asi.nombre as nombre_asignatura,
      asi.color as color_asignatura,
      u.nombre as nombre_docente
    FROM actividad_evaluable ae
    JOIN asignacion_docente ad ON ae.id_asignacion = ad.id_asignacion
    JOIN asignatura asi ON ad.id_asignatura = asi.id_asignatura
    JOIN usuario u ON ae.creado_por = u.id_usuario
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
    (titulo, descripcion, fecha_inicio, fecha_fin, id_tipo, id_estado, id_asignacion, creado_por) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  try {
    const [result] = await pool.query(sql, [
      datos.titulo,
      datos.descripcion,
      datos.fecha_inicio,
      datos.fecha_fin,
      datos.id_tipo,
      datos.id_estado,
      datos.id_asignacion,
      datos.creado_por
    ]);

    // Devolvemos el objeto creado con su nuevo ID
    return { id_actividad: result.insertId, ...datos };
  } catch (error) {
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
      titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?,
      id_tipo = ?, id_estado = ?, id_asignacion = ?
    WHERE id_actividad = ?
  `;
  const [result] = await pool.query(sql, [
    datos.titulo, datos.descripcion, datos.fecha_inicio, datos.fecha_fin,
    datos.id_tipo, datos.id_estado, datos.id_asignacion, id
  ]);
  return result.affectedRows > 0 ? { id_actividad: id, ...datos } : null;
};

module.exports = {
  getAllActividadesEvaluables,
  createActividadEvaluable,
  getActividadEvaluableById,
  deleteActividadEvaluable,
  updateActividadEvaluable
};