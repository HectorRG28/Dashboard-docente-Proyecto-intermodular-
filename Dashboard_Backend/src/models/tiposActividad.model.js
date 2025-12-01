// src/models/tiposActividad.model.js
// ----------------------------------------------------------
// Modelo para la tabla "tipo_actividad".
// Encapsula todas las consultas SQL relacionadas con los
// tipos de actividad (examen, tarea, proyecto, etc.).
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                      // Pool de conexiones (promesas de mysql2)

let sqlSelectAllTipos;         // Consulta: obtener todos los tipos de actividad
let sqlSelectTipoById;         // Consulta: obtener un tipo por id
let sqlInsertTipo;             // Consulta: insertar un tipo
let sqlUpdateTipo;             // Consulta: actualizar un tipo
let sqlDeleteTipo;             // Consulta: eliminar un tipo

let getAllTiposActividad;      // Función: devuelve lista de tipos
let getTipoActividadById;      // Función: devuelve un tipo por id
let createTipoActividad;       // Función: crea un nuevo tipo
let updateTipoActividad;       // Función: actualiza un tipo existente
let deleteTipoActividad;       // Función: elimina un tipo

// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODOS los tipos de actividad
sqlSelectAllTipos = `
  SELECT
    id_tipo,
    nombre_tipo,
    descripcion
  FROM tipo_actividad
  ORDER BY nombre_tipo ASC
`;

// Consulta para obtener UN tipo de actividad por id
sqlSelectTipoById = `
  SELECT
    id_tipo,
    nombre_tipo,
    descripcion
  FROM tipo_actividad
  WHERE id_tipo = ?
`;

// Consulta para insertar un nuevo tipo de actividad
sqlInsertTipo = `
  INSERT INTO tipo_actividad (
    nombre_tipo,
    descripcion
  )
  VALUES (?, ?)
`;

// Consulta para actualizar un tipo de actividad existente
sqlUpdateTipo = `
  UPDATE tipo_actividad
  SET
    nombre_tipo = ?,
    descripcion = ?
  WHERE id_tipo = ?
`;

// Consulta para eliminar un tipo de actividad
sqlDeleteTipo = `
  DELETE FROM tipo_actividad
  WHERE id_tipo = ?
`;

// 3. FUNCIONES DEL MODELO

// Devuelve todos los tipos de actividad
getAllTiposActividad = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllTipos);
    rows = result[0];

    return rows; // Array de tipos de actividad
  } catch (dbError) {
    let error;

    console.error('Error en getAllTiposActividad (modelo):', dbError);

    error = new Error('Error al obtener los tipos de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve un tipo de actividad por su id (o null si no existe)
getTipoActividadById = async function (idTipo) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectTipoById, [idTipo]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getTipoActividadById (modelo):', dbError);

    error = new Error('Error al obtener el tipo de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea un nuevo tipo de actividad y devuelve el objeto creado
createTipoActividad = async function (datosTipo) {
  let result;
  let insertResult;
  let nuevoTipo;

  try {
    result = await pool.query(sqlInsertTipo, [
      datosTipo.nombre_tipo,
      datosTipo.descripcion
    ]);

    insertResult = result[0];

    nuevoTipo = {
      id_tipo: insertResult.insertId,
      nombre_tipo: datosTipo.nombre_tipo,
      descripcion: datosTipo.descripcion
    };

    return nuevoTipo;
  } catch (dbError) {
    let error;

    console.error('Error en createTipoActividad (modelo):', dbError);

    error = new Error('Error al crear el tipo de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza un tipo de actividad existente. Devuelve el tipo actualizado o null si no existe.
updateTipoActividad = async function (idTipo, datosTipo) {
  let result;
  let updateResult;
  let tipoActualizado;

  try {
    result = await pool.query(sqlUpdateTipo, [
      datosTipo.nombre_tipo,
      datosTipo.descripcion,
      idTipo
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró el tipo
    }

    tipoActualizado = {
      id_tipo: idTipo,
      nombre_tipo: datosTipo.nombre_tipo,
      descripcion: datosTipo.descripcion
    };

    return tipoActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updateTipoActividad (modelo):', dbError);

    error = new Error('Error al actualizar el tipo de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina un tipo de actividad. Devuelve true si eliminó, false si no existía.
deleteTipoActividad = async function (idTipo) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteTipo, [idTipo]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había tipo con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteTipoActividad (modelo):', dbError);

    error = new Error('Error al eliminar el tipo de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllTiposActividad,
  getTipoActividadById,
  createTipoActividad,
  updateTipoActividad,
  deleteTipoActividad
};
