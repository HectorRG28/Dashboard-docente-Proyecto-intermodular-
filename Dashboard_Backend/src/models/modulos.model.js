// src/models/modulos.model.js
// ----------------------------------------------------------
// Modelo para la tabla "modulo".
// Encapsula todas las consultas SQL relacionadas con módulos.
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                   // Pool de conexiones (promesas de mysql2)

let sqlSelectAllModulos;    // Consulta: obtener todos los módulos
let sqlSelectModuloById;    // Consulta: obtener un módulo por id
let sqlInsertModulo;        // Consulta: insertar módulo
let sqlUpdateModulo;        // Consulta: actualizar módulo
let sqlDeleteModulo;        // Consulta: eliminar módulo

let getAllModulos;          // Función: devuelve lista de módulos
let getModuloById;          // Función: devuelve un módulo por id
let createModulo;           // Función: crea un nuevo módulo
let updateModulo;           // Función: actualiza un módulo existente
let deleteModulo;           // Función: elimina un módulo

// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODOS los módulos
sqlSelectAllModulos = `
  SELECT
    id_modulo,
    nombre_modulo,
    codigo_modulo,
    horas_totales,
    created_at,
    updated_at
  FROM modulo
  ORDER BY nombre_modulo ASC
`;

// Consulta para obtener UN módulo por id
sqlSelectModuloById = `
  SELECT
    id_modulo,
    nombre_modulo,
    codigo_modulo,
    horas_totales,
    created_at,
    updated_at
  FROM modulo
  WHERE id_modulo = ?
`;

// Consulta para insertar un nuevo módulo
sqlInsertModulo = `
  INSERT INTO modulo (
    nombre_modulo,
    codigo_modulo,
    horas_totales
  )
  VALUES (?, ?, ?)
`;

// Consulta para actualizar un módulo existente
sqlUpdateModulo = `
  UPDATE modulo
  SET
    nombre_modulo = ?,
    codigo_modulo = ?,
    horas_totales = ?
  WHERE id_modulo = ?
`;

// Consulta para eliminar un módulo por id
sqlDeleteModulo = `
  DELETE FROM modulo
  WHERE id_modulo = ?
`;

// 3. FUNCIONES DEL MODELO

// Devuelve todos los módulos
getAllModulos = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllModulos);
    rows = result[0];

    return rows; // Array de módulos
  } catch (dbError) {
    let error;

    console.error('Error en getAllModulos (modelo):', dbError);

    error = new Error('Error al obtener los módulos');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve un módulo por su id (o null si no existe)
getModuloById = async function (idModulo) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectModuloById, [idModulo]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getModuloById (modelo):', dbError);

    error = new Error('Error al obtener el módulo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea un nuevo módulo y devuelve el objeto creado
createModulo = async function (datosModulo) {
  let result;
  let insertResult;
  let nuevoModulo;

  try {
    result = await pool.query(sqlInsertModulo, [
      datosModulo.nombre_modulo,
      datosModulo.codigo_modulo,
      datosModulo.horas_totales
    ]);

    insertResult = result[0];

    nuevoModulo = {
      id_modulo: insertResult.insertId,
      nombre_modulo: datosModulo.nombre_modulo,
      codigo_modulo: datosModulo.codigo_modulo,
      horas_totales: datosModulo.horas_totales
    };

    return nuevoModulo;
  } catch (dbError) {
    let error;

    console.error('Error en createModulo (modelo):', dbError);

    error = new Error('Error al crear el módulo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza un módulo existente. Devuelve el módulo actualizado o null si no existe.
updateModulo = async function (idModulo, datosModulo) {
  let result;
  let updateResult;
  let moduloActualizado;

  try {
    result = await pool.query(sqlUpdateModulo, [
      datosModulo.nombre_modulo,
      datosModulo.codigo_modulo,
      datosModulo.horas_totales,
      idModulo
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró el módulo
    }

    moduloActualizado = {
      id_modulo: idModulo,
      nombre_modulo: datosModulo.nombre_modulo,
      codigo_modulo: datosModulo.codigo_modulo,
      horas_totales: datosModulo.horas_totales
    };

    return moduloActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updateModulo (modelo):', dbError);

    error = new Error('Error al actualizar el módulo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina un módulo. Devuelve true si eliminó, false si no existía.
deleteModulo = async function (idModulo) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteModulo, [idModulo]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había módulo con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteModulo (modelo):', dbError);

    error = new Error('Error al eliminar el módulo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllModulos,
  getModuloById,
  createModulo,
  updateModulo,
  deleteModulo
};
