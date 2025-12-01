// src/controllers/tiposActividad.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso TIPO_ACTIVIDAD.
// Lee req/res y delega en el modelo de tipos de actividad.
// ----------------------------------------------------------

// 1. DECLARACIONES
let tiposActividadModel;           // Modelo que habla con la tabla tipo_actividad

let getTiposActividadHandler;      // GET /tipos-actividad
let getTipoActividadByIdHandler;   // GET /tipos-actividad/:id
let createTipoActividadHandler;    // POST /tipos-actividad
let updateTipoActividadHandler;    // PUT /tipos-actividad/:id
let deleteTipoActividadHandler;    // DELETE /tipos-actividad/:id

// 2. ASIGNACIONES
tiposActividadModel = require('../models/tiposActividad.model');

// GET /tipos-actividad → lista todos los tipos de actividad
getTiposActividadHandler = async function (req, res) {
  let tipos;

  try {
    tipos = await tiposActividadModel.getAllTiposActividad();

    return res.status(200).json({
      ok: true,
      data: tipos
    });
  } catch (error) {
    console.error('Error en getTiposActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los tipos de actividad'
    });
  }
};

// GET /tipos-actividad/:id → obtiene un tipo de actividad por id
getTipoActividadByIdHandler = async function (req, res) {
  let idParam;
  let idTipo;
  let tipo;

  idParam = req.params.id;
  idTipo = parseInt(idParam, 10);

  if (isNaN(idTipo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    tipo = await tiposActividadModel.getTipoActividadById(idTipo);

    if (!tipo) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún tipo de actividad con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: tipo
    });
  } catch (error) {
    console.error('Error en getTipoActividadByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el tipo de actividad'
    });
  }
};

// POST /tipos-actividad → crea un nuevo tipo de actividad
// Body esperado:
// {
//   "nombre_tipo": "Examen",
//   "descripcion": "Prueba escrita en aula"
// }
createTipoActividadHandler = async function (req, res) {
  let body;
  let nombre_tipo;
  let descripcion;
  let datosTipo;
  let nuevoTipo;

  body = req.body;

  nombre_tipo = body.nombre_tipo;
  descripcion = body.descripcion;

  if (nombre_tipo === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Falta el campo obligatorio: nombre_tipo'
    });
  }

  datosTipo = {
    nombre_tipo: nombre_tipo,
    descripcion: descripcion || null
  };

  try {
    nuevoTipo = await tiposActividadModel.createTipoActividad(datosTipo);

    return res.status(201).json({
      ok: true,
      mensaje: 'Tipo de actividad creado correctamente',
      data: nuevoTipo
    });
  } catch (error) {
    console.error('Error en createTipoActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el tipo de actividad'
    });
  }
};

// PUT /tipos-actividad/:id → actualiza un tipo de actividad existente
updateTipoActividadHandler = async function (req, res) {
  let idParam;
  let idTipo;
  let body;
  let nombre_tipo;
  let descripcion;
  let datosTipo;
  let tipoActualizado;

  idParam = req.params.id;
  idTipo = parseInt(idParam, 10);

  if (isNaN(idTipo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  nombre_tipo = body.nombre_tipo;
  descripcion = body.descripcion;

  if (nombre_tipo === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Falta el campo obligatorio: nombre_tipo'
    });
  }

  datosTipo = {
    nombre_tipo: nombre_tipo,
    descripcion: descripcion || null
  };

  try {
    tipoActualizado = await tiposActividadModel.updateTipoActividad(idTipo, datosTipo);

    if (!tipoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún tipo de actividad con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Tipo de actividad actualizado correctamente',
      data: tipoActualizado
    });
  } catch (error) {
    console.error('Error en updateTipoActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el tipo de actividad'
    });
  }
};

// DELETE /tipos-actividad/:id → elimina un tipo de actividad
deleteTipoActividadHandler = async function (req, res) {
  let idParam;
  let idTipo;
  let eliminado;

  idParam = req.params.id;
  idTipo = parseInt(idParam, 10);

  if (isNaN(idTipo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await tiposActividadModel.deleteTipoActividad(idTipo);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún tipo de actividad con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Tipo de actividad eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteTipoActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el tipo de actividad'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getTiposActividadHandler,
  getTipoActividadByIdHandler,
  createTipoActividadHandler,
  updateTipoActividadHandler,
  deleteTipoActividadHandler
};
