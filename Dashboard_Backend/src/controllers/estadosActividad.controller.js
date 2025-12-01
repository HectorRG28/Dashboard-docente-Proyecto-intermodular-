// src/controllers/estadosActividad.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso ESTADO_ACTIVIDAD.
// Lee req/res y delega en el modelo de estados de actividad.
// ----------------------------------------------------------

// 1. DECLARACIONES
let estadosActividadModel;           // Modelo que habla con la tabla estado_actividad

let getEstadosActividadHandler;      // GET /estados-actividad
let getEstadoActividadByIdHandler;   // GET /estados-actividad/:id
let createEstadoActividadHandler;    // POST /estados-actividad
let updateEstadoActividadHandler;    // PUT /estados-actividad/:id
let deleteEstadoActividadHandler;    // DELETE /estados-actividad/:id

// 2. ASIGNACIONES
estadosActividadModel = require('../models/estadosActividad.model');

// GET /estados-actividad → lista todos los estados de actividad
getEstadosActividadHandler = async function (req, res) {
  let estados;

  try {
    estados = await estadosActividadModel.getAllEstadosActividad();

    return res.status(200).json({
      ok: true,
      data: estados
    });
  } catch (error) {
    console.error('Error en getEstadosActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los estados de actividad'
    });
  }
};

// GET /estados-actividad/:id → obtiene un estado de actividad por id
getEstadoActividadByIdHandler = async function (req, res) {
  let idParam;
  let idEstado;
  let estado;

  idParam = req.params.id;
  idEstado = parseInt(idParam, 10);

  if (isNaN(idEstado)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    estado = await estadosActividadModel.getEstadoActividadById(idEstado);

    if (!estado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún estado de actividad con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: estado
    });
  } catch (error) {
    console.error('Error en getEstadoActividadByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el estado de actividad'
    });
  }
};

// POST /estados-actividad → crea un nuevo estado de actividad
// Body esperado:
// {
//   "nombre_estado": "Pendiente",
//   "descripcion": "Actividad aún no realizada"
// }
createEstadoActividadHandler = async function (req, res) {
  let body;
  let nombre_estado;
  let descripcion;
  let datosEstado;
  let nuevoEstado;

  body = req.body;

  nombre_estado = body.nombre_estado;
  descripcion = body.descripcion;

  if (nombre_estado === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Falta el campo obligatorio: nombre_estado'
    });
  }

  datosEstado = {
    nombre_estado: nombre_estado,
    descripcion: descripcion || null
  };

  try {
    nuevoEstado = await estadosActividadModel.createEstadoActividad(datosEstado);

    return res.status(201).json({
      ok: true,
      mensaje: 'Estado de actividad creado correctamente',
      data: nuevoEstado
    });
  } catch (error) {
    console.error('Error en createEstadoActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el estado de actividad'
    });
  }
};

// PUT /estados-actividad/:id → actualiza un estado de actividad existente
updateEstadoActividadHandler = async function (req, res) {
  let idParam;
  let idEstado;
  let body;
  let nombre_estado;
  let descripcion;
  let datosEstado;
  let estadoActualizado;

  idParam = req.params.id;
  idEstado = parseInt(idParam, 10);

  if (isNaN(idEstado)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  nombre_estado = body.nombre_estado;
  descripcion = body.descripcion;

  if (nombre_estado === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Falta el campo obligatorio: nombre_estado'
    });
  }

  datosEstado = {
    nombre_estado: nombre_estado,
    descripcion: descripcion || null
  };

  try {
    estadoActualizado = await estadosActividadModel.updateEstadoActividad(idEstado, datosEstado);

    if (!estadoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún estado de actividad con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Estado de actividad actualizado correctamente',
      data: estadoActualizado
    });
  } catch (error) {
    console.error('Error en updateEstadoActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el estado de actividad'
    });
  }
};

// DELETE /estados-actividad/:id → elimina un estado
deleteEstadoActividadHandler = async function (req, res) {
  let idParam;
  let idEstado;
  let eliminado;

  idParam = req.params.id;
  idEstado = parseInt(idParam, 10);

  if (isNaN(idEstado)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await estadosActividadModel.deleteEstadoActividad(idEstado);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún estado de actividad con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Estado de actividad eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteEstadoActividadHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el estado de actividad'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getEstadosActividadHandler,
  getEstadoActividadByIdHandler,
  createEstadoActividadHandler,
  updateEstadoActividadHandler,
  deleteEstadoActividadHandler
};
