// src/models/periodos.model.js
// ----------------------------------------------------------
// Modelo para la tabla "periodo_evaluacion".
// ----------------------------------------------------------

// 1. DECLARACIONES
let pool;

let sqlSelectAllPeriodos;
let sqlSelectPeriodoById;
let sqlInsertPeriodo;
let sqlUpdatePeriodo;
let sqlDeletePeriodo;

let getAllPeriodos;
let getPeriodoById;
let createPeriodo;
let updatePeriodo;
let deletePeriodo;

// 2. ASIGNACIONES
pool = require('../db/pool');

sqlSelectAllPeriodos = `
  SELECT
    p.id_periodo,
    p.id_curso,
    c.nombre_curso,
    p.nombre_periodo,
    p.fecha_inicio,
    p.fecha_fin,
    p.created_at,
    p.updated_at
  FROM periodo_evaluacion AS p
  INNER JOIN curso_academico AS c ON p.id_curso = c.id_curso
  ORDER BY c.fecha_inicio DESC, p.fecha_inicio ASC
`;

sqlSelectPeriodoById = `
  SELECT
    p.id_periodo,
    p.id_curso,
    c.nombre_curso,
    p.nombre_periodo,
    p.fecha_inicio,
    p.fecha_fin,
    p.created_at,
    p.updated_at
  FROM periodo_evaluacion AS p
  INNER JOIN curso_academico AS c ON p.id_curso = c.id_curso
  WHERE p.id_periodo = ?
`;

sqlInsertPeriodo = `
  INSERT INTO periodo_evaluacion (
    id_curso,
    nombre_periodo,
    fecha_inicio,
    fecha_fin
  )
  VALUES (?, ?, ?, ?)
`;

sqlUpdatePeriodo = `
  UPDATE periodo_evaluacion
  SET
    id_curso       = ?,
    nombre_periodo = ?,
    fecha_inicio   = ?,
    fecha_fin      = ?
  WHERE id_periodo = ?
`;

sqlDeletePeriodo = `
  DELETE FROM periodo_evaluacion
  WHERE id_periodo = ?
`;

// 3. FUNCIONES

getAllPeriodos = async function () {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectAllPeriodos);
    rows = result[0];

    return rows;
  } catch (dbError) {
    let error;

    console.error('Error en getAllPeriodos (modelo):', dbError);

    error = new Error('Error al obtener los periodos de evaluación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

getPeriodoById = async function (idPeriodo) {
  let result;
  let rows;

  try {
    result = await pool.query(sqlSelectPeriodoById, [idPeriodo]);
    rows = result[0];

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (dbError) {
    let error;

    console.error('Error en getPeriodoById (modelo):', dbError);

    error = new Error('Error al obtener el periodo de evaluación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

createPeriodo = async function (datosPeriodo) {
  let result;
  let insertResult;
  let nuevoPeriodo;

  try {
    result = await pool.query(sqlInsertPeriodo, [
      datosPeriodo.id_curso,
      datosPeriodo.nombre_periodo,
      datosPeriodo.fecha_inicio,
      datosPeriodo.fecha_fin
    ]);

    insertResult = result[0];

    nuevoPeriodo = {
      id_periodo: insertResult.insertId,
      id_curso: datosPeriodo.id_curso,
      nombre_periodo: datosPeriodo.nombre_periodo,
      fecha_inicio: datosPeriodo.fecha_inicio,
      fecha_fin: datosPeriodo.fecha_fin
    };

    return nuevoPeriodo;
  } catch (dbError) {
    let error;

    console.error('Error en createPeriodo (modelo):', dbError);

    error = new Error('Error al crear el periodo de evaluación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

updatePeriodo = async function (idPeriodo, datosPeriodo) {
  let result;
  let updateResult;
  let periodoActualizado;

  try {
    result = await pool.query(sqlUpdatePeriodo, [
      datosPeriodo.id_curso,
      datosPeriodo.nombre_periodo,
      datosPeriodo.fecha_inicio,
      datosPeriodo.fecha_fin,
      idPeriodo
    ]);

    updateResult = result[0];

    if (updateResult.affectedRows === 0) {
      return null;
    }

    periodoActualizado = {
      id_periodo: idPeriodo,
      id_curso: datosPeriodo.id_curso,
      nombre_periodo: datosPeriodo.nombre_periodo,
      fecha_inicio: datosPeriodo.fecha_inicio,
      fecha_fin: datosPeriodo.fecha_fin
    };

    return periodoActualizado;
  } catch (dbError) {
    let error;

    console.error('Error en updatePeriodo (modelo):', dbError);

    error = new Error('Error al actualizar el periodo de evaluación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

deletePeriodo = async function (idPeriodo) {
  let result;
  let deleteResult;

  try {
    result = await pool.query(sqlDeletePeriodo, [idPeriodo]);
    deleteResult = result[0];

    if (deleteResult.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (dbError) {
    let error;

    console.error('Error en deletePeriodo (modelo):', dbError);

    error = new Error('Error al eliminar el periodo de evaluación');
    error.originalError = dbError;
    error.type = 'DATABASE_ERROR';

    throw error;
  }
};

// 4. EXPORTACIONES
module.exports = {
  getAllPeriodos,
  getPeriodoById,
  createPeriodo,
  updatePeriodo,
  deletePeriodo
};

