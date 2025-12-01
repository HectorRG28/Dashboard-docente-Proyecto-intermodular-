// src/models/calificaciones.model.js
// ----------------------------------------------------------
// Modelo para la tabla "calificacion".
// Encapsula todas las consultas SQL relacionadas con las
// calificaciones de alumnos en actividades evaluables.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                           // Pool de conexiones (promesas de mysql2)

let sqlSelectAllCalificaciones;     // Consulta: obtener todas las calificaciones
let sqlSelectCalificacionById;      // Consulta: obtener una calificación por id
let sqlInsertCalificacion;          // Consulta: insertar una calificación
let sqlUpdateCalificacion;          // Consulta: actualizar una calificación
let sqlDeleteCalificacion;          // Consulta: eliminar una calificación

let getAllCalificaciones;           // Función: devuelve lista de calificaciones
let getCalificacionById;            // Función: devuelve una calificación por id
let createCalificacion;             // Función: crea una nueva calificación
let updateCalificacion;             // Función: actualiza una calificación existente
let deleteCalificacion;             // Función: elimina una calificación


// 2. ASIGNACIONES
pool = require('../db/pool');

// Consulta para obtener TODAS las calificaciones con JOINs
sqlSelectAllCalificaciones = `
  SELECT
    ca.id_calificacion,

    ca.id_actividad,
    a.titulo           AS titulo_actividad,
    a.fecha_inicio     AS fecha_actividad,

    ca.id_alumno,
    u.nombre           AS nombre_alumno,
    u.apellidos        AS apellidos_alumno,
    u.email            AS email_alumno,

    ca.nota,
    ca.comentario,
    ca.fecha_calificacion,
    ca.revisado,

    ca.created_at,
    ca.updated_at
  FROM calificacion AS ca
  INNER JOIN actividad_evaluable AS a ON ca.id_actividad = a.id_actividad
  INNER JOIN usuario             AS u ON ca.id_alumno    = u.id_usuario
  ORDER BY
    a.fecha_inicio ASC,
    u.apellidos ASC,
    u.nombre ASC
`;

// Consulta para obtener UNA calificación por id
sqlSelectCalificacionById = `
  SELECT
    ca.id_calificacion,

    ca.id_actividad,
    a.titulo           AS titulo_actividad,
    a.fecha_inicio     AS fecha_actividad,

    ca.id_alumno,
    u.nombre           AS nombre_alumno,
    u.apellidos        AS apellidos_alumno,
    u.email            AS email_alumno,

    ca.nota,
    ca.comentario,
    ca.fecha_calificacion,
    ca.revisado,

    ca.created_at,
    ca.updated_at
  FROM calificacion AS ca
  INNER JOIN actividad_evaluable AS a ON ca.id_actividad = a.id_actividad
  INNER JOIN usuario             AS u ON ca.id_alumno    = u.id_usuario
  WHERE ca.id_calificacion = ?
`;

// Consulta para insertar una nueva calificación
sqlInsertCalificacion = `
  INSERT INTO calificacion (
    id_actividad,
    id_alumno,
    nota,
    comentario,
    fecha_calificacion,
    revisado
  )
  VALUES (?, ?, ?, ?, ?, ?)
`;

// Consulta para actualizar una calificación existente
sqlUpdateCalificacion = `
  UPDATE calificacion
  SET
    id_actividad       = ?,
    id_alumno          = ?,
    nota               = ?,
    comentario         = ?,
    fecha_calificacion = ?,
    revisado           = ?
  WHERE id_calificacion = ?
`;

// Consulta para eliminar una calificación
sqlDeleteCalificacion = `
  DELETE FROM calificacion
  WHERE id_calificacion = ?
`;


// 3. FUNCIONES DEL MODELO

// Devuelve todas las calificaciones
getAllCalificaciones = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllCalificaciones);
    rows = result[0];

    return rows;
  } catch (dbError) {
    let error;

    console.error('Error en getAllCalificaciones (modelo):', dbError);

    error = new Error('Error al obtener las calificaciones');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve una calificación por su id (o null si no existe)
getCalificacionById = async function (idCalificacion) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectCalificacionById, [idCalificacion]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getCalificacionById (modelo):', dbError);

    error = new Error('Error al obtener la calificación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea una nueva calificación y devuelve el objeto creado
createCalificacion = async function (datosCalificacion) {
  let result;
  let insertResult;
  let nuevaCalificacion;

  try {
    result = await pool.query(sqlInsertCalificacion, [
      datosCalificacion.id_actividad,
      datosCalificacion.id_alumno,
      datosCalificacion.nota,
      datosCalificacion.comentario,
      datosCalificacion.fecha_calificacion,
      datosCalificacion.revisado
    ]);

    insertResult = result[0];

    nuevaCalificacion = {
      id_calificacion: insertResult.insertId,
      id_actividad: datosCalificacion.id_actividad,
      id_alumno: datosCalificacion.id_alumno,
      nota: datosCalificacion.nota,
      comentario: datosCalificacion.comentario,
      fecha_calificacion: datosCalificacion.fecha_calificacion,
      revisado: datosCalificacion.revisado
    };

    return nuevaCalificacion;
  } catch (dbError) {
    let error;

    console.error('Error en createCalificacion (modelo):', dbError);

    error = new Error('Error al crear la calificación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza una calificación existente. Devuelve la calificación actualizada o null si no existe.
updateCalificacion = async function (idCalificacion, datosCalificacion) {
  let result;
  let updateResult;
  let calificacionActualizada;

  try {
    result = await pool.query(sqlUpdateCalificacion, [
      datosCalificacion.id_actividad,
      datosCalificacion.id_alumno,
      datosCalificacion.nota,
      datosCalificacion.comentario,
      datosCalificacion.fecha_calificacion,
      datosCalificacion.revisado,
      idCalificacion
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null;
    }

    calificacionActualizada = {
      id_calificacion: idCalificacion,
      id_actividad: datosCalificacion.id_actividad,
      id_alumno: datosCalificacion.id_alumno,
      nota: datosCalificacion.nota,
      comentario: datosCalificacion.comentario,
      fecha_calificacion: datosCalificacion.fecha_calificacion,
      revisado: datosCalificacion.revisado
    };

    return calificacionActualizada;
  } catch (dbError) {
    let error;

    console.error('Error en updateCalificacion (modelo):', dbError);

    error = new Error('Error al actualizar la calificación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina una calificación. Devuelve true si eliminó, false si no existía.
deleteCalificacion = async function (idCalificacion) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteCalificacion, [idCalificacion]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteCalificacion (modelo):', dbError);

    error = new Error('Error al eliminar la calificación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllCalificaciones,
  getCalificacionById,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
};

