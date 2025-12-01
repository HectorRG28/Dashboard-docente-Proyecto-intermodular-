// src/models/grupos.model.js
// ----------------------------------------------------------
// Modelo para la tabla "grupo".
// Encapsula todas las consultas SQL relacionadas con grupos.
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                  // Pool de conexiones (promesas)

let sqlSelectAllGrupos;    // Consulta: obtener todos los grupos
let sqlSelectGrupoById;    // Consulta: obtener un grupo por id
let sqlInsertGrupo;        // Consulta: insertar grupo
let sqlUpdateGrupo;        // Consulta: actualizar grupo
let sqlDeleteGrupo;        // Consulta: eliminar grupo

let getAllGrupos;          // Función: devuelve lista de grupos
let getGrupoById;          // Función: devuelve un grupo por id
let createGrupo;           // Función: crea un nuevo grupo
let updateGrupo;           // Función: actualiza un grupo existente
let deleteGrupo;           // Función: elimina un grupo

// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODOS los grupos, incluyendo el nombre del curso asociado
sqlSelectAllGrupos = `
  SELECT
    g.id_grupo,
    g.id_curso,
    c.nombre_curso,
    g.nombre_grupo,
    g.created_at,
    g.updated_at
  FROM grupo AS g
  INNER JOIN curso_academico AS c ON g.id_curso = c.id_curso
  ORDER BY c.fecha_inicio DESC, g.nombre_grupo ASC
`;

// Consulta para obtener UN grupo por id, con datos del curso
sqlSelectGrupoById = `
  SELECT
    g.id_grupo,
    g.id_curso,
    c.nombre_curso,
    g.nombre_grupo,
    g.created_at,
    g.updated_at
  FROM grupo AS g
  INNER JOIN curso_academico AS c ON g.id_curso = c.id_curso
  WHERE g.id_grupo = ?
`;

// Consulta para insertar un grupo
sqlInsertGrupo = `
  INSERT INTO grupo (
    id_curso,
    nombre_grupo
  )
  VALUES (?, ?)
`;

// Consulta para actualizar un grupo
sqlUpdateGrupo = `
  UPDATE grupo
  SET
    id_curso     = ?,
    nombre_grupo = ?
  WHERE id_grupo = ?
`;

// Consulta para eliminar un grupo por id
sqlDeleteGrupo = `
  DELETE FROM grupo
  WHERE id_grupo = ?
`;

// 3. FUNCIONES DEL MODELO

// Devuelve todos los grupos (con info básica del curso)
getAllGrupos = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllGrupos);
    rows = result[0];

    return rows; // Array de grupos
  } catch (dbError) {
    let error;

    console.error('Error en getAllGrupos (modelo):', dbError);

    error = new Error('Error al obtener los grupos');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve un grupo por su id (o null si no existe)
getGrupoById = async function (idGrupo) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectGrupoById, [idGrupo]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getGrupoById (modelo):', dbError);

    error = new Error('Error al obtener el grupo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea un nuevo grupo y devuelve el objeto creado
createGrupo = async function (datosGrupo) {
  let result;
  let insertResult;
  let nuevoGrupo;

  try {
    result = await pool.query(sqlInsertGrupo, [
      datosGrupo.id_curso,
      datosGrupo.nombre_grupo
    ]);

    insertResult = result[0];

    nuevoGrupo = {
      id_grupo: insertResult.insertId,
      id_curso: datosGrupo.id_curso,
      nombre_grupo: datosGrupo.nombre_grupo
    };

    return nuevoGrupo;
  } catch (dbError) {
    let error;

    console.error('Error en createGrupo (modelo):', dbError);

    error = new Error('Error al crear el grupo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza un grupo existente. Devuelve el grupo actualizado o null si no existe.
updateGrupo = async function (idGrupo, datosGrupo) {
  let result;
  let updateResult;
  let grupoActualizado;

  try {
    result = await pool.query(sqlUpdateGrupo, [
      datosGrupo.id_curso,
      datosGrupo.nombre_grupo,
      idGrupo
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró el grupo
    }

    grupoActualizado = {
      id_grupo: idGrupo,
      id_curso: datosGrupo.id_curso,
      nombre_grupo: datosGrupo.nombre_grupo
    };

    return grupoActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updateGrupo (modelo):', dbError);

    error = new Error('Error al actualizar el grupo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina un grupo. Devuelve true si eliminó, false si no existía.
deleteGrupo = async function (idGrupo) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteGrupo, [idGrupo]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había grupo con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteGrupo (modelo):', dbError);

    error = new Error('Error al eliminar el grupo');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo
};
