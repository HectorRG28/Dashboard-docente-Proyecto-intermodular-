// src/controllers/periodos.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso PERIODO_EVALUACION.
// ----------------------------------------------------------

// 1. DECLARACIONES
let periodosModel;

let getPeriodosHandler;
let getPeriodoByIdHandler;
let createPeriodoHandler;
let updatePeriodoHandler;
let deletePeriodoHandler;

// 2. ASIGNACIONES
periodosModel = require('../models/periodos.model');

getPeriodosHandler = async function (req, res) {
  let periodos;

  try {
    periodos = await periodosModel.getAllPeriodos();

    return res.status(200).json({
      ok: true,
      data: periodos
    });
  } catch (error) {
    console.error('Error en getPeriodosHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los periodos de evaluación'
    });
  }
};

getPeriodoByIdHandler = async function (req, res) {
  let idParam;
  let idPeriodo;
  let periodo;

  idParam = req.params.id;
  idPeriodo = parseInt(idParam, 10);

  if (isNaN(idPeriodo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    periodo = await periodosModel.getPeriodoById(idPeriodo);

    if (!periodo) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún periodo de evaluación con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: periodo
    });
  } catch (error) {
    console.error('Error en getPeriodoByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el periodo de evaluación'
    });
  }
};

createPeriodoHandler = async function (req, res) {
  let body;
  let id_curso;
  let nombre_periodo;
  let fecha_inicio;
  let fecha_fin;
  let datosPeriodo;
  let nuevoPeriodo;

  body = req.body;

  id_curso = body.id_curso;
  nombre_periodo = body.nombre_periodo;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;

  if (
    id_curso === undefined ||
    nombre_periodo === undefined ||
    fecha_inicio === undefined ||
    fecha_fin === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_curso, nombre_periodo, fecha_inicio, fecha_fin'
    });
  }

  if (isNaN(parseInt(id_curso, 10))) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_curso debe ser un número entero válido'
    });
  }

  datosPeriodo = {
    id_curso: parseInt(id_curso, 10),
    nombre_periodo: nombre_periodo,
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin
  };

  try {
    nuevoPeriodo = await periodosModel.createPeriodo(datosPeriodo);

    return res.status(201).json({
      ok: true,
      mensaje: 'Periodo de evaluación creado correctamente',
      data: nuevoPeriodo
    });
  } catch (error) {
    console.error('Error en createPeriodoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el periodo de evaluación'
    });
  }
};

updatePeriodoHandler = async function (req, res) {
  let idParam;
  let idPeriodo;
  let body;
  let id_curso;
  let nombre_periodo;
  let fecha_inicio;
  let fecha_fin;
  let datosPeriodo;
  let periodoActualizado;

  idParam = req.params.id;
  idPeriodo = parseInt(idParam, 10);

  if (isNaN(idPeriodo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  id_curso = body.id_curso;
  nombre_periodo = body.nombre_periodo;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;

  if (
    id_curso === undefined ||
    nombre_periodo === undefined ||
    fecha_inicio === undefined ||
    fecha_fin === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_curso, nombre_periodo, fecha_inicio, fecha_fin'
    });
  }

  if (isNaN(parseInt(id_curso, 10))) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_curso debe ser un número entero válido'
    });
  }

  datosPeriodo = {
    id_curso: parseInt(id_curso, 10),
    nombre_periodo: nombre_periodo,
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin
  };

  try {
    periodoActualizado = await periodosModel.updatePeriodo(idPeriodo, datosPeriodo);

    if (!periodoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún periodo de evaluación con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Periodo de evaluación actualizado correctamente',
      data: periodoActualizado
    });
  } catch (error) {
    console.error('Error en updatePeriodoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el periodo de evaluación'
    });
  }
};

deletePeriodoHandler = async function (req, res) {
  let idParam;
  let idPeriodo;
  let eliminado;

  idParam = req.params.id;
  idPeriodo = parseInt(idParam, 10);

  if (isNaN(idPeriodo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await periodosModel.deletePeriodo(idPeriodo);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún periodo de evaluación con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Periodo de evaluación eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deletePeriodoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el periodo de evaluación'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getPeriodosHandler,
  getPeriodoByIdHandler,
  createPeriodoHandler,
  updatePeriodoHandler,
  deletePeriodoHandler
};
