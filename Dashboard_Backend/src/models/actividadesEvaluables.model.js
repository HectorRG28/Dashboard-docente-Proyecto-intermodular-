// src/models/actividadesEvaluables.model.js
// ----------------------------------------------------------
// Modelo para la tabla "actividad_evaluable".
// Encapsula todas las consultas SQL relacionadas con las
// actividades evaluables creadas por los docentes.
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                                    // Pool de conexiones (promesas de mysql2)

let sqlSelectAllActividades;                 // Consulta: obtener todas las actividades
let sqlSelectActividadById;                  // Consulta: obtener una actividad por id
let sqlInsertActividad;                      // Consulta: insertar una actividad
let sqlUpdateActividad;                      // Consulta: actualizar una actividad
let sqlDeleteActividad;                      // Consulta: eliminar una actividad

let getAllActividadesEvaluables;             // Función: devuelve lista de actividades
let getActividadEvaluableById;               // Función: devuelve una actividad por id
let createActividadEvaluable;                // Función: crea una nueva actividad
let updateActividadEvaluable;                // Función: actualiza una actividad existente
let deleteActividadEvaluable;                // Función: elimina una actividad


// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODAS las actividades, con datos enriquecidos
sqlSelectAllActividades = `
  SELECT
    a.id_actividad,

    a.id_asignacion,
    ad.id_docente,
    u.nombre        AS nombre_docente,
    u.apellidos     AS apellidos_docente,

    ad.id_modulo,
    m.nombre_modulo,
    m.codigo_modulo,

    ad.id_grupo,
    g.nombre_grupo,

    ad.id_curso,
    c.nombre_curso,

    a.id_tipo,
    t.nombre_tipo,

    a.id_estado,
    e.nombre_estado,

    a.id_periodo,
    p.nombre_periodo,

    a.creado_por,
    uc.nombre       AS nombre_creador,
    uc.apellidos    AS apellidos_creador,

    a.titulo,
    a.descripcion,
    a.fecha_inicio,
    a.fecha_fin,
    a.peso,

    a.created_at,
    a.updated_at
  FROM actividad_evaluable AS a
  INNER JOIN asignacion_docente AS ad ON a.id_asignacion = ad.id_asignacion
  INNER JOIN usuario           AS u  ON ad.id_docente     = u.id_usuario
  INNER JOIN modulo            AS m  ON ad.id_modulo      = m.id_modulo
  INNER JOIN grupo             AS g  ON ad.id_grupo       = g.id_grupo
  INNER JOIN curso_academico   AS c  ON ad.id_curso       = c.id_curso
  INNER JOIN tipo_actividad    AS t  ON a.id_tipo         = t.id_tipo
  INNER JOIN estado_actividad  AS e  ON a.id_estado       = e.id_estado
  LEFT JOIN periodo_evaluacion AS p  ON a.id_periodo      = p.id_periodo
  INNER JOIN usuario           AS uc ON a.creado_por      = uc.id_usuario
  ORDER BY
    a.fecha_inicio ASC,
    c.fecha_inicio DESC,
    g.nombre_grupo ASC,
    m.nombre_modulo ASC
`;

// Consulta para obtener UNA actividad por id, con datos enriquecidos
sqlSelectActividadById = `
  SELECT
    a.id_actividad,

    a.id_asignacion,
    ad.id_docente,
    u.nombre        AS nombre_docente,
    u.apellidos     AS apellidos_docente,

    ad.id_modulo,
    m.nombre_modulo,
    m.codigo_modulo,

    ad.id_grupo,
    g.nombre_grupo,

    ad.id_curso,
    c.nombre_curso,

    a.id_tipo,
    t.nombre_tipo,

    a.id_estado,
    e.nombre_estado,

    a.id_periodo,
    p.nombre_periodo,

    a.creado_por,
    uc.nombre       AS nombre_creador,
    uc.apellidos    AS apellidos_creador,

    a.titulo,
    a.descripcion,
    a.fecha_inicio,
    a.fecha_fin,
    a.peso,

    a.created_at,
    a.updated_at
  FROM actividad_evaluable AS a
  INNER JOIN asignacion_docente AS ad ON a.id_asignacion = ad.id_asignacion
  INNER JOIN usuario           AS u  ON ad.id_docente     = u.id_usuario
  INNER JOIN modulo            AS m  ON ad.id_modulo      = m.id_modulo
  INNER JOIN grupo             AS g  ON ad.id_grupo       = g.id_grupo
  INNER JOIN curso_academico   AS c  ON ad.id_curso       = c.id_curso
  INNER JOIN tipo_actividad    AS t  ON a.id_tipo         = t.id_tipo
  INNER JOIN estado_actividad  AS e  ON a.id_estado       = e.id_estado
  LEFT JOIN periodo_evaluacion AS p  ON a.id_periodo      = p.id_periodo
  INNER JOIN usuario           AS uc ON a.creado_por      = uc.id_usuario
  WHERE a.id_actividad = ?
`;

// Consulta para insertar una nueva actividad
sqlInsertActividad = `
  INSERT INTO actividad_evaluable (
    id_asignacion,
    id_tipo,
    id_estado,
    id_periodo,
    creado_por,
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    peso
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// Consulta para actualizar una actividad existente
sqlUpdateActividad = `
  UPDATE actividad_evaluable
  SET
    id_asignacion = ?,
    id_tipo       = ?,
    id_estado     = ?,
    id_periodo    = ?,
    creado_por    = ?,
    titulo        = ?,
    descripcion   = ?,
    fecha_inicio  = ?,
    fecha_fin     = ?,
    peso          = ?
  WHERE id_actividad = ?
`;

// Consulta para eliminar una actividad
sqlDeleteActividad = `
  DELETE FROM actividad_evaluable
  WHERE id_actividad = ?
`;


// 3. FUNCIONES DEL MODELO

// Devuelve todas las actividades evaluables
getAllActividadesEvaluables = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllActividades);
    rows = result[0];

    return rows; // Array de actividades
  } catch (dbError) {
    let error;

    console.error('Error en getAllActividadesEvaluables (modelo):', dbError);

    error = new Error('Error al obtener las actividades evaluables');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve una actividad por su id (o null si no existe)
getActividadEvaluableById = async function (idActividad) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectActividadById, [idActividad]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getActividadEvaluableById (modelo):', dbError);

    error = new Error('Error al obtener la actividad evaluable');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea una nueva actividad y devuelve el objeto creado (básico)
createActividadEvaluable = async function (datosActividad) {
  let result;
  let insertResult;
  let nuevaActividad;

  try {
    result = await pool.query(sqlInsertActividad, [
      datosActividad.id_asignacion,
      datosActividad.id_tipo,
      datosActividad.id_estado,
      datosActividad.id_periodo,
      datosActividad.creado_por,
      datosActividad.titulo,
      datosActividad.descripcion,
      datosActividad.fecha_inicio,
      datosActividad.fecha_fin,
      datosActividad.peso
    ]);

    insertResult = result[0];

    nuevaActividad = {
      id_actividad: insertResult.insertId,
      id_asignacion: datosActividad.id_asignacion,
      id_tipo: datosActividad.id_tipo,
      id_estado: datosActividad.id_estado,
      id_periodo: datosActividad.id_periodo,
      creado_por: datosActividad.creado_por,
      titulo: datosActividad.titulo,
      descripcion: datosActividad.descripcion,
      fecha_inicio: datosActividad.fecha_inicio,
      fecha_fin: datosActividad.fecha_fin,
      peso: datosActividad.peso
    };

    return nuevaActividad;
  } catch (dbError) {
    let error;

    console.error('Error en createActividadEvaluable (modelo):', dbError);

    error = new Error('Error al crear la actividad evaluable');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza una actividad existente. Devuelve la actividad actualizada o null si no existe.
updateActividadEvaluable = async function (idActividad, datosActividad) {
  let result;
  let updateResult;
  let actividadActualizada;

  try {
    result = await pool.query(sqlUpdateActividad, [
      datosActividad.id_asignacion,
      datosActividad.id_tipo,
      datosActividad.id_estado,
      datosActividad.id_periodo,
      datosActividad.creado_por,
      datosActividad.titulo,
      datosActividad.descripcion,
      datosActividad.fecha_inicio,
      datosActividad.fecha_fin,
      datosActividad.peso,
      idActividad
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró la actividad
    }

    actividadActualizada = {
      id_actividad: idActividad,
      id_asignacion: datosActividad.id_asignacion,
      id_tipo: datosActividad.id_tipo,
      id_estado: datosActividad.id_estado,
      id_periodo: datosActividad.id_periodo,
      creado_por: datosActividad.creado_por,
      titulo: datosActividad.titulo,
      descripcion: datosActividad.descripcion,
      fecha_inicio: datosActividad.fecha_inicio,
      fecha_fin: datosActividad.fecha_fin,
      peso: datosActividad.peso
    };

    return actividadActualizada;
  } catch (dbError) {
    let error;

    console.error('Error en updateActividadEvaluable (modelo):', dbError);

    error = new Error('Error al actualizar la actividad evaluable');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina una actividad. Devuelve true si eliminó, false si no existía.
deleteActividadEvaluable = async function (idActividad) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteActividad, [idActividad]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había actividad con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteActividadEvaluable (modelo):', dbError);

    error = new Error('Error al eliminar la actividad evaluable');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllActividadesEvaluables,
  getActividadEvaluableById,
  createActividadEvaluable,
  updateActividadEvaluable,
  deleteActividadEvaluable
};
