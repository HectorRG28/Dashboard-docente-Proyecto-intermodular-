// src/models/estadosActividad.model.js
// ----------------------------------------------------------
// Modelo para la tabla "estado_actividad".
// Encapsula todas las consultas SQL relacionadas con los
// estados de actividad (pendiente, publicada, corregida, etc.).
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                        // Pool de conexiones (promesas de mysql2)

let sqlSelectAllEstados;         // Consulta: obtener todos los estados
let sqlSelectEstadoById;         // Consulta: obtener un estado por id
let sqlInsertEstado;             // Consulta: insertar un estado
let sqlUpdateEstado;             // Consulta: actualizar un estado
let sqlDeleteEstado;             // Consulta: eliminar un estado

let getAllEstadosActividad;      // Función: devuelve lista de estados
let getEstadoActividadById;      // Función: devuelve un estado por id
let createEstadoActividad;       // Función: crea un nuevo estado
let updateEstadoActividad;       // Función: actualiza un estado existente
let deleteEstadoActividad;       // Función: elimina un estado

// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODOS los estados de actividad
sqlSelectAllEstados = `
  SELECT
    id_estado,
    nombre_estado,
    descripcion
  FROM estado_actividad
  ORDER BY nombre_estado ASC
`;

// Consulta para obtener UN estado por id
sqlSelectEstadoById = `
  SELECT
    id_estado,
    nombre_estado,
    descripcion
  FROM estado_actividad
  WHERE id_estado = ?
`;

// Consulta para insertar un nuevo estado
sqlInsertEstado = `
  INSERT INTO estado_actividad (
    nombre_estado,
    descripcion
  )
  VALUES (?, ?)
`;

// Consulta para actualizar un estado existente
sqlUpdateEstado = `
  UPDATE estado_actividad
  SET
    nombre_estado = ?,
    descripcion   = ?
  WHERE id_estado = ?
`;

// Consulta para eliminar un estado
sqlDeleteEstado = `
  DELETE FROM estado_actividad
  WHERE id_estado = ?
`;

// 3. FUNCIONES DEL MODELO

// Devuelve todos los estados de actividad
getAllEstadosActividad = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllEstados);
    rows = result[0];

    return rows; // Array de estados
  } catch (dbError) {
    let error;

    console.error('Error en getAllEstadosActividad (modelo):', dbError);

    error = new Error('Error al obtener los estados de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve un estado de actividad por su id (o null si no existe)
getEstadoActividadById = async function (idEstado) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectEstadoById, [idEstado]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getEstadoActividadById (modelo):', dbError);

    error = new Error('Error al obtener el estado de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea un nuevo estado de actividad y devuelve el objeto creado
createEstadoActividad = async function (datosEstado) {
  let result;
  let insertResult;
  let nuevoEstado;

  try {
    result = await pool.query(sqlInsertEstado, [
      datosEstado.nombre_estado,
      datosEstado.descripcion
    ]);

    insertResult = result[0];

    nuevoEstado = {
      id_estado: insertResult.insertId,
      nombre_estado: datosEstado.nombre_estado,
      descripcion: datosEstado.descripcion
    };

    return nuevoEstado;
  } catch (dbError) {
    let error;

    console.error('Error en createEstadoActividad (modelo):', dbError);

    error = new Error('Error al crear el estado de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza un estado existente. Devuelve el estado actualizado o null si no existe.
updateEstadoActividad = async function (idEstado, datosEstado) {
  let result;
  let updateResult;
  let estadoActualizado;

  try {
    result = await pool.query(sqlUpdateEstado, [
      datosEstado.nombre_estado,
      datosEstado.descripcion,
      idEstado
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró el estado
    }

    estadoActualizado = {
      id_estado: idEstado,
      nombre_estado: datosEstado.nombre_estado,
      descripcion: datosEstado.descripcion
    };

    return estadoActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updateEstadoActividad (modelo):', dbError);

    error = new Error('Error al actualizar el estado de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina un estado de actividad. Devuelve true si eliminó, false si no existía.
deleteEstadoActividad = async function (idEstado) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteEstado, [idEstado]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había estado con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteEstadoActividad (modelo):', dbError);

    error = new Error('Error al eliminar el estado de actividad');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllEstadosActividad,
  getEstadoActividadById,
  createEstadoActividad,
  updateEstadoActividad,
  deleteEstadoActividad
};
