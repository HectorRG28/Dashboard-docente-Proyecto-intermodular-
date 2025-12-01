// src/models/asignacionesDocentes.model.js
// ----------------------------------------------------------
// Modelo para la tabla "asignacion_docente".
// Encapsula todas las consultas SQL relacionadas con las
// asignaciones de docentes a módulos, grupos y cursos.
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                               // Pool de conexiones (promesas de mysql2)

let sqlSelectAllAsignaciones;           // Consulta: obtener todas las asignaciones
let sqlSelectAsignacionById;            // Consulta: obtener una asignación por id
let sqlInsertAsignacion;                // Consulta: insertar una asignación
let sqlUpdateAsignacion;                // Consulta: actualizar una asignación
let sqlDeleteAsignacion;                // Consulta: eliminar una asignación

let getAllAsignacionesDocentes;         // Función: devuelve lista de asignaciones
let getAsignacionDocenteById;           // Función: devuelve una asignación por id
let createAsignacionDocente;            // Función: crea una nueva asignación
let updateAsignacionDocente;            // Función: actualiza una asignación existente
let deleteAsignacionDocente;            // Función: elimina una asignación


// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODAS las asignaciones, con datos enriquecidos
sqlSelectAllAsignaciones = `
  SELECT
    a.id_asignacion,

    a.id_docente,
    u.nombre       AS nombre_docente,
    u.apellidos    AS apellidos_docente,
    u.email        AS email_docente,

    a.id_modulo,
    m.nombre_modulo,
    m.codigo_modulo,

    a.id_grupo,
    g.nombre_grupo,

    a.id_curso,
    c.nombre_curso,

    a.horas_asignadas,
    a.fecha_inicio,
    a.fecha_fin,

    a.created_at,
    a.updated_at
  FROM asignacion_docente AS a
  INNER JOIN usuario         AS u ON a.id_docente = u.id_usuario
  INNER JOIN modulo          AS m ON a.id_modulo  = m.id_modulo
  INNER JOIN grupo           AS g ON a.id_grupo   = g.id_grupo
  INNER JOIN curso_academico AS c ON a.id_curso   = c.id_curso
  ORDER BY
    c.fecha_inicio DESC,
    g.nombre_grupo ASC,
    m.nombre_modulo ASC
`;

// Consulta para obtener UNA asignación por id, con datos enriquecidos
sqlSelectAsignacionById = `
  SELECT
    a.id_asignacion,

    a.id_docente,
    u.nombre       AS nombre_docente,
    u.apellidos    AS apellidos_docente,
    u.email        AS email_docente,

    a.id_modulo,
    m.nombre_modulo,
    m.codigo_modulo,

    a.id_grupo,
    g.nombre_grupo,

    a.id_curso,
    c.nombre_curso,

    a.horas_asignadas,
    a.fecha_inicio,
    a.fecha_fin,

    a.created_at,
    a.updated_at
  FROM asignacion_docente AS a
  INNER JOIN usuario         AS u ON a.id_docente = u.id_usuario
  INNER JOIN modulo          AS m ON a.id_modulo  = m.id_modulo
  INNER JOIN grupo           AS g ON a.id_grupo   = g.id_grupo
  INNER JOIN curso_academico AS c ON a.id_curso   = c.id_curso
  WHERE a.id_asignacion = ?
`;

// Consulta para insertar una nueva asignación
sqlInsertAsignacion = `
  INSERT INTO asignacion_docente (
    id_docente,
    id_modulo,
    id_grupo,
    id_curso,
    horas_asignadas,
    fecha_inicio,
    fecha_fin
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

// Consulta para actualizar una asignación existente
sqlUpdateAsignacion = `
  UPDATE asignacion_docente
  SET
    id_docente      = ?,
    id_modulo       = ?,
    id_grupo        = ?,
    id_curso        = ?,
    horas_asignadas = ?,
    fecha_inicio    = ?,
    fecha_fin       = ?
  WHERE id_asignacion = ?
`;

// Consulta para eliminar una asignación
sqlDeleteAsignacion = `
  DELETE FROM asignacion_docente
  WHERE id_asignacion = ?
`;


// 3. FUNCIONES DEL MODELO

// Devuelve todas las asignaciones de docentes
getAllAsignacionesDocentes = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllAsignaciones);
    rows = result[0];

    return rows; // Array de asignaciones
  } catch (dbError) {
    let error;

    console.error('Error en getAllAsignacionesDocentes (modelo):', dbError);

    error = new Error('Error al obtener las asignaciones de docentes');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve una asignación por su id (o null si no existe)
getAsignacionDocenteById = async function (idAsignacion) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAsignacionById, [idAsignacion]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getAsignacionDocenteById (modelo):', dbError);

    error = new Error('Error al obtener la asignación de docente');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea una nueva asignación y devuelve el objeto creado (sin joins)
createAsignacionDocente = async function (datosAsignacion) {
  let result;
  let insertResult;
  let nuevaAsignacion;

  try {
    result = await pool.query(sqlInsertAsignacion, [
      datosAsignacion.id_docente,
      datosAsignacion.id_modulo,
      datosAsignacion.id_grupo,
      datosAsignacion.id_curso,
      datosAsignacion.horas_asignadas,
      datosAsignacion.fecha_inicio,
      datosAsignacion.fecha_fin
    ]);

    insertResult = result[0];

    nuevaAsignacion = {
      id_asignacion: insertResult.insertId,
      id_docente: datosAsignacion.id_docente,
      id_modulo: datosAsignacion.id_modulo,
      id_grupo: datosAsignacion.id_grupo,
      id_curso: datosAsignacion.id_curso,
      horas_asignadas: datosAsignacion.horas_asignadas,
      fecha_inicio: datosAsignacion.fecha_inicio,
      fecha_fin: datosAsignacion.fecha_fin
    };

    return nuevaAsignacion;
  } catch (dbError) {
    let error;

    console.error('Error en createAsignacionDocente (modelo):', dbError);

    error = new Error('Error al crear la asignación de docente');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza una asignación existente. Devuelve la asignación actualizada o null si no existe.
updateAsignacionDocente = async function (idAsignacion, datosAsignacion) {
  let result;
  let updateResult;
  let asignacionActualizada;

  try {
    result = await pool.query(sqlUpdateAsignacion, [
      datosAsignacion.id_docente,
      datosAsignacion.id_modulo,
      datosAsignacion.id_grupo,
      datosAsignacion.id_curso,
      datosAsignacion.horas_asignadas,
      datosAsignacion.fecha_inicio,
      datosAsignacion.fecha_fin,
      idAsignacion
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró la asignación
    }

    asignacionActualizada = {
      id_asignacion: idAsignacion,
      id_docente: datosAsignacion.id_docente,
      id_modulo: datosAsignacion.id_modulo,
      id_grupo: datosAsignacion.id_grupo,
      id_curso: datosAsignacion.id_curso,
      horas_asignadas: datosAsignacion.horas_asignadas,
      fecha_inicio: datosAsignacion.fecha_inicio,
      fecha_fin: datosAsignacion.fecha_fin
    };

    return asignacionActualizada;
  } catch (dbError) {
    let error;

    console.error('Error en updateAsignacionDocente (modelo):', dbError);

    error = new Error('Error al actualizar la asignación de docente');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina una asignación. Devuelve true si eliminó, false si no existía.
deleteAsignacionDocente = async function (idAsignacion) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteAsignacion, [idAsignacion]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había asignación con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteAsignacionDocente (modelo):', dbError);

    error = new Error('Error al eliminar la asignación de docente');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllAsignacionesDocentes,
  getAsignacionDocenteById,
  createAsignacionDocente,
  updateAsignacionDocente,
  deleteAsignacionDocente
};

