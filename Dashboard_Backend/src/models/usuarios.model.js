// src/models/usuarios.model.js
// ----------------------------------------------------------
// Modelo para la tabla "usuario".
// Encapsula todas las consultas SQL relacionadas con usuarios.
// NO sabe nada de HTTP ni de Express. Solo habla con la base de datos.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                    // Pool de conexiones (promesas)

let sqlSelectAllUsuarios;    // Consulta: obtener todos los usuarios
let sqlSelectUsuarioById;    // Consulta: obtener un usuario por id
let sqlInsertUsuario;        // Consulta: insertar usuario
let sqlUpdateUsuario;        // Consulta: actualizar usuario
let sqlDeleteUsuario;        // Consulta: eliminar usuario

let getAllUsuarios;          // Función: devuelve lista de usuarios
let getUsuarioById;          // Función: devuelve un usuario por id
let createUsuario;           // Función: crea un nuevo usuario
let updateUsuario;           // Función: actualiza un usuario existente
let deleteUsuario;           // Función: elimina un usuario

// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODOS los usuarios
sqlSelectAllUsuarios = `
  SELECT
    id_usuario,
    nombre,
    apellidos,
    email,
    rol,
    estado,
    created_at,
    updated_at
  FROM usuario
  ORDER BY id_usuario
`;

// Consulta para obtener UN usuario concreto por id
sqlSelectUsuarioById = `
  SELECT
    id_usuario,
    nombre,
    apellidos,
    email,
    rol,
    estado,
    created_at,
    updated_at
  FROM usuario
  WHERE id_usuario = ?
`;

// Consulta para insertar un nuevo usuario
sqlInsertUsuario = `
  INSERT INTO usuario (
    nombre,
    apellidos,
    email,
    rol,
    estado
  )
  VALUES (?, ?, ?, ?, ?)
`;

// Consulta para actualizar un usuario existente
sqlUpdateUsuario = `
  UPDATE usuario
  SET
    nombre    = ?,
    apellidos = ?,
    email     = ?,
    rol       = ?,
    estado    = ?
  WHERE id_usuario = ?
`;

// Consulta para eliminar un usuario por id
sqlDeleteUsuario = `
  DELETE FROM usuario
  WHERE id_usuario = ?
`;

// 3. FUNCIONES DEL MODELO

// Devuelve todos los usuarios
getAllUsuarios = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllUsuarios);
    rows = result[0];

    return rows; // Array de usuarios
  } catch (dbError) {
    let error;

    console.error('Error en getAllUsuarios (modelo):', dbError);

    error = new Error('Error al obtener los usuarios');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve un usuario por su id (o null si no existe)
getUsuarioById = async function (idUsuario) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectUsuarioById, [idUsuario]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getUsuarioById (modelo):', dbError);

    error = new Error('Error al obtener el usuario');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea un nuevo usuario y devuelve el objeto creado
createUsuario = async function (datosUsuario) {
  let result;
  let insertResult;
  let nuevoUsuario;

  try {
    result = await pool.query(sqlInsertUsuario, [
      datosUsuario.nombre,
      datosUsuario.apellidos,
      datosUsuario.email,
      datosUsuario.rol,
      datosUsuario.estado
    ]);

    insertResult = result[0];

    nuevoUsuario = {
      id_usuario: insertResult.insertId,
      nombre: datosUsuario.nombre,
      apellidos: datosUsuario.apellidos,
      email: datosUsuario.email,
      rol: datosUsuario.rol,
      estado: datosUsuario.estado
    };

    return nuevoUsuario;
  } catch (dbError) {
    let error;

    console.error('Error en createUsuario (modelo):', dbError);

    error = new Error('Error al crear el usuario');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza un usuario existente. Devuelve el usuario actualizado o null si no existe.
updateUsuario = async function (idUsuario, datosUsuario) {
  let result;
  let updateResult;
  let usuarioActualizado;

  try {
    result = await pool.query(sqlUpdateUsuario, [
      datosUsuario.nombre,
      datosUsuario.apellidos,
      datosUsuario.email,
      datosUsuario.rol,
      datosUsuario.estado,
      idUsuario
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró el usuario
    }

    usuarioActualizado = {
      id_usuario: idUsuario,
      nombre: datosUsuario.nombre,
      apellidos: datosUsuario.apellidos,
      email: datosUsuario.email,
      rol: datosUsuario.rol,
      estado: datosUsuario.estado
    };

    return usuarioActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updateUsuario (modelo):', dbError);

    error = new Error('Error al actualizar el usuario');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina un usuario. Devuelve true si eliminó, false si no existía.
deleteUsuario = async function (idUsuario) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteUsuario, [idUsuario]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había usuario con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteUsuario (modelo):', dbError);

    error = new Error('Error al eliminar el usuario');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};

