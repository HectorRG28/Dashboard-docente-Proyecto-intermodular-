// src/models/matriculas.model.js
// ----------------------------------------------------------
// Modelo para la tabla "matricula".
// Encapsula todas las consultas SQL relacionadas con las
// matrículas de alumnos en grupos y cursos.
// No sabe nada de HTTP ni de Express, solo habla con la BD.
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;                        // Pool de conexiones (promesas de mysql2)

let sqlSelectAllMatriculas;      // Consulta: obtener todas las matrículas
let sqlSelectMatriculaById;      // Consulta: obtener una matrícula por id
let sqlInsertMatricula;          // Consulta: insertar una matrícula
let sqlUpdateMatricula;          // Consulta: actualizar una matrícula
let sqlDeleteMatricula;          // Consulta: eliminar una matrícula

let getAllMatriculas;            // Función: devuelve lista de matrículas
let getMatriculaById;            // Función: devuelve una matrícula por id
let createMatricula;             // Función: crea una nueva matrícula
let updateMatricula;             // Función: actualiza una matrícula existente
let deleteMatricula;             // Función: elimina una matrícula


// 2. ASIGNACIONES
pool = require('../db/pool');   // Importamos el pool de conexiones

// Consulta para obtener TODAS las matrículas, con datos enriquecidos
sqlSelectAllMatriculas = `
  SELECT
    m.id_matricula,

    m.id_alumno,
    u.nombre        AS nombre_alumno,
    u.apellidos     AS apellidos_alumno,
    u.email         AS email_alumno,

    m.id_grupo,
    g.nombre_grupo,

    m.id_curso,
    c.nombre_curso,

    m.fecha_matricula,
    m.created_at,
    m.updated_at
  FROM matricula AS m
  INNER JOIN usuario         AS u ON m.id_alumno = u.id_usuario
  INNER JOIN grupo           AS g ON m.id_grupo  = g.id_grupo
  INNER JOIN curso_academico AS c ON m.id_curso  = c.id_curso
  ORDER BY
    c.fecha_inicio DESC,
    g.nombre_grupo ASC,
    u.apellidos ASC,
    u.nombre ASC
`;

// Consulta para obtener UNA matrícula por id, con datos enriquecidos
sqlSelectMatriculaById = `
  SELECT
    m.id_matricula,

    m.id_alumno,
    u.nombre        AS nombre_alumno,
    u.apellidos     AS apellidos_alumno,
    u.email         AS email_alumno,

    m.id_grupo,
    g.nombre_grupo,

    m.id_curso,
    c.nombre_curso,

    m.fecha_matricula,
    m.created_at,
    m.updated_at
  FROM matricula AS m
  INNER JOIN usuario         AS u ON m.id_alumno = u.id_usuario
  INNER JOIN grupo           AS g ON m.id_grupo  = g.id_grupo
  INNER JOIN curso_academico AS c ON m.id_curso  = c.id_curso
  WHERE m.id_matricula = ?
`;

// Consulta para insertar una nueva matrícula
sqlInsertMatricula = `
  INSERT INTO matricula (
    id_alumno,
    id_grupo,
    id_curso,
    fecha_matricula
  )
  VALUES (?, ?, ?, ?)
`;

// Consulta para actualizar una matrícula existente
sqlUpdateMatricula = `
  UPDATE matricula
  SET
    id_alumno       = ?,
    id_grupo        = ?,
    id_curso        = ?,
    fecha_matricula = ?
  WHERE id_matricula = ?
`;

// Consulta para eliminar una matrícula
sqlDeleteMatricula = `
  DELETE FROM matricula
  WHERE id_matricula = ?
`;


// 3. FUNCIONES DEL MODELO

// Devuelve todas las matrículas
getAllMatriculas = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllMatriculas);
    rows = result[0];

    return rows; // Array de matrículas
  } catch (dbError) {
    let error;

    console.error('Error en getAllMatriculas (modelo):', dbError);

    error = new Error('Error al obtener las matrículas');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Devuelve una matrícula por su id (o null si no existe)
getMatriculaById = async function (idMatricula) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectMatriculaById, [idMatricula]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getMatriculaById (modelo):', dbError);

    error = new Error('Error al obtener la matrícula');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Crea una nueva matrícula y devuelve el objeto creado (básico)
createMatricula = async function (datosMatricula) {
  let result;
  let insertResult;
  let nuevaMatricula;

  try {
    result = await pool.query(sqlInsertMatricula, [
      datosMatricula.id_alumno,
      datosMatricula.id_grupo,
      datosMatricula.id_curso,
      datosMatricula.fecha_matricula
    ]);

    insertResult = result[0];

    nuevaMatricula = {
      id_matricula: insertResult.insertId,
      id_alumno: datosMatricula.id_alumno,
      id_grupo: datosMatricula.id_grupo,
      id_curso: datosMatricula.id_curso,
      fecha_matricula: datosMatricula.fecha_matricula
    };

    return nuevaMatricula;
  } catch (dbError) {
    let error;

    console.error('Error en createMatricula (modelo):', dbError);

    error = new Error('Error al crear la matrícula');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Actualiza una matrícula existente. Devuelve la matrícula actualizada o null si no existe.
updateMatricula = async function (idMatricula, datosMatricula) {
  let result;
  let updateResult;
  let matriculaActualizada;

  try {
    result = await pool.query(sqlUpdateMatricula, [
      datosMatricula.id_alumno,
      datosMatricula.id_grupo,
      datosMatricula.id_curso,
      datosMatricula.fecha_matricula,
      idMatricula
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null; // No se encontró la matrícula
    }

    matriculaActualizada = {
      id_matricula: idMatricula,
      id_alumno: datosMatricula.id_alumno,
      id_grupo: datosMatricula.id_grupo,
      id_curso: datosMatricula.id_curso,
      fecha_matricula: datosMatricula.fecha_matricula
    };

    return matriculaActualizada;
  } catch (dbError) {
    let error;

    console.error('Error en updateMatricula (modelo):', dbError);

    error = new Error('Error al actualizar la matrícula');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// Elimina una matrícula. Devuelve true si eliminó, false si no existía.
deleteMatricula = async function (idMatricula) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeleteMatricula, [idMatricula]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false; // No había matrícula con ese id
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deleteMatricula (modelo):', dbError);

    error = new Error('Error al eliminar la matrícula');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllMatriculas,
  getMatriculaById,
  createMatricula,
  updateMatricula,
  deleteMatricula
};
