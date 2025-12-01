// src/models/cursos.model.js
// ----------------------------------------------------------
// Modelo para la tabla "curso_academico".
// Encapsula todas las consultas SQL relacionadas con cursos
// académicos. No sabe nada de HTTP ni de Express.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                 // Pool de conexiones (promesas)

let sqlSelectAllCursos;   // Consulta: obtener todos los cursos
let sqlSelectCursoById;   // Consulta: obtener un curso por id
let sqlInsertCurso;       // Consulta: insertar curso
let sqlUpdateCurso;       // Consulta: actualizar curso
let sqlDeleteCurso;       // Consulta: eliminar curso

let getAllCursos;         // Función: devuelve lista de cursos
let getCursoById;         // Función: devuelve un curso por id
let createCurso;          // Función: crea un nuevo curso
let updateCurso;          // Función: actualiza un curso existente
let deleteCurso;          // Función: elimina un curso

// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODOS los cursos académicos
sqlSelectAllCursos = `
  SELECT
    id_curso,
    nombre_curso,
    fecha_inicio,
    fecha_fin,
    estado,
    created_at,
    updated_at
  FROM curso_academico
  ORDER BY fecha_inicio DESC
`;

// Consulta para obtener UN curso por id
sqlSelectCursoById = `
  SELECT
    id_curso,
    nombre_curso,
    fecha_inicio,
    fecha_fin,
    estado,
    created_at,
    updated_at
  FROM curso_academico
  WHERE id_curso = ?
`;

// Consulta para insertar un nuevo curso académico
sqlInsertCurso = `
  INSERT INTO curso_academico (
    nombre_curso,
    fecha_inicio,
    fecha_fin,
    estado
  )
  VALUES (?, ?, ?, ?)
`;

// Consulta para actualizar un curso existente
sqlUpdateCurso = `
  UPDATE curso_academico
  SET
    nombre_curso = ?,
    fecha_inicio = ?,
    fecha_fin    = ?,
    estado       = ?
  WHERE id_curso = ?
`;

// Consulta para eliminar un curso por id
sqlDeleteCurso = `
  DELETE FROM curso_academico
  WHERE id_curso = ?
`;

// 3. FUNCIONES DEL MODELO

// Devuelve todos los cursos académicos
getAllCursos = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllCursos);
    rows = result[0];

    return rows; // Array de cursos
  } catch (dbError) {
    let error;

    console.error('Error en getAllCursos (modelo):', dbError);

    error = new Error('Error al obtener los cursos académicos');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve un curso por su id (o null si no existe)
getCursoById = async function (idCurso) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectCursoById, [idCurso]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getCursoById (modelo):', dbError);

    error = new Error('Error al obtener el curso académico');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea un nuevo curso académico y devuelve el objeto creado
createCurso = async function (datosCurso) {
  let result;
  let insertResult;
  let nuevoCurso;

  try {
    result = await pool.query(sqlInsertCurso, [
      datosCurso.nombre_curso,
      datosCurso.fecha_inicio,
      datosCurso.fecha_fin,
      datosCurso.estado
    ]);

    insertResult = result[0];

    nuevoCurso = {
      id_curso: insertResult.insertId,
      nombre_curso: datosCurso.nombre_curso,
      fecha_inicio: datosCurso.fecha_inicio,
      fecha_fin: datosCurso.fecha_fin,
      estado: datosCurso.estado
    };

    return nuevoCurso;
  } catch (dbError) {
    let error;

    console.error('Error en createCurso (modelo):', dbError);

    error = new Error('Error al crear el curso académico');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza un curso existente. Devuelve el curso actualizado o null si no existe.
updateCurso = async function (idCurso, datosCurso) {
  let result;
  let updateResult;
  let cursoActualizado;

  try {
    result = await pool.query(sqlUpdateCurso, [
      datosCurso.nombre_curso,
      datosCurso.fecha_inicio,
      datosCurso.fecha_fin,
      datosCurso.estado,
      idCurso
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró el curso
    }

    cursoActualizado = {
      id_curso: idCurso,
      nombre_curso: datosCurso.nombre_curso,
      fecha_inicio: datosCurso.fecha_inicio,
      fecha_fin: datosCurso.fecha_fin,
      estado: datosCurso.estado
    };

    return cursoActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updateCurso (modelo):', dbError);

    error = new Error('Error al actualizar el curso académico');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina un curso. Devuelve true si eliminó, false si no existía.
deleteCurso = async function (idCurso) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteCurso, [idCurso]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había curso con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteCurso (modelo):', dbError);

    error = new Error('Error al eliminar el curso académico');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
};
