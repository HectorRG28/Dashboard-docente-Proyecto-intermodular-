// src/controllers/calificaciones.controller.js
// ----------------------------------------------------------
// Controladores HTTP para el recurso CALIFICACION.
// Lee req/res y delega en el modelo de calificaciones.
// ----------------------------------------------------------

// 1. DECLARACIONES
let calificacionesModel;           // Modelo que habla con la tabla calificacion

let getCalificacionesHandler;      // GET /calificaciones
let getCalificacionByIdHandler;    // GET /calificaciones/:id
let createCalificacionHandler;     // POST /calificaciones
let updateCalificacionHandler;     // PUT /calificaciones/:id
let deleteCalificacionHandler;     // DELETE /calificaciones/:id


// 2. ASIGNACIONES
calificacionesModel = require('../models/calificaciones.model');

// GET /calificaciones → lista todas las calificaciones
getCalificacionesHandler = async function (req, res) {
  let calificaciones;

  try {
    calificaciones = await calificacionesModel.getAllCalificaciones();

    return res.status(200).json({
      ok: true,
      data: calificaciones
    });
  } catch (error) {
    console.error('Error en getCalificacionesHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener las calificaciones'
    });
  }
};

// GET /calificaciones/:id → obtiene una calificación por id
getCalificacionByIdHandler = async function (req, res) {
  let idParam;
  let idCalificacion;
  let calificacion;

  idParam = req.params.id;
  idCalificacion = parseInt(idParam, 10);

  if (isNaN(idCalificacion)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El ID debe ser un número válido'
    });
  }

  try {
    calificacion = await calificacionesModel.getCalificacionById(idCalificacion);

    if (!calificacion) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Calificación no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      data: calificacion
    });
  } catch (error) {
    console.error('Error en getCalificacionByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener la calificación'
    });
  }
};

// POST /calificaciones → crea una nueva calificación
// Body esperado (ejemplo):
// {
//   "id_actividad": 1,
//   "id_alumno": 5,
//   "nota": 7.5,
//   "comentario": "Buen trabajo",
//   "fecha_calificacion": "2025-02-10 10:30:00",
//   "revisado": 0
// }
createCalificacionHandler = async function (req, res) {
  let body;
  let id_actividad;
  let id_alumno;
  let nota;
  let comentario;
  let fecha_calificacion;
  let revisado;

  let datosCalificacion;
  let nuevaCalificacion;

  body = req.body;

  id_actividad = body.id_actividad;
  id_alumno = body.id_alumno;
  nota = body.nota;
  comentario = body.comentario;
  fecha_calificacion = body.fecha_calificacion;
  revisado = body.revisado;

  // Campos obligatorios
  if (
    id_actividad === undefined ||
    id_alumno === undefined ||
    nota === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_actividad, id_alumno, nota'
    });
  }

  // Validación de tipos numéricos
  if (
    isNaN(parseInt(id_actividad, 10)) ||
    isNaN(parseInt(id_alumno, 10)) ||
    isNaN(parseFloat(nota))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_actividad, id_alumno y nota deben ser numéricos válidos'
    });
  }

  // revisado opcional, pero si viene debe ser 0 o 1
  if (
    revisado !== undefined &&
    revisado !== null &&
    ![0, 1, '0', '1', true, false].includes(revisado)
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'revisado debe ser 0/1 (false/true) si se indica'
    });
  }

  datosCalificacion = {
    id_actividad: parseInt(id_actividad, 10),
    id_alumno: parseInt(id_alumno, 10),
    nota: parseFloat(nota),
    comentario: comentario || null,
    fecha_calificacion: fecha_calificacion || null,
    revisado: (revisado === undefined || revisado === null)
      ? 0
      : (revisado === true || revisado === '1' || revisado === 1 ? 1 : 0)
  };

  try {
    nuevaCalificacion = await calificacionesModel.createCalificacion(datosCalificacion);

    return res.status(201).json({
      ok: true,
      mensaje: 'Calificación creada correctamente',
      data: nuevaCalificacion
    });
  } catch (error) {
    console.error('Error en createCalificacionHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al crear la calificación'
    });
  }
};

// PUT /calificaciones/:id → actualiza una calificación existente
updateCalificacionHandler = async function (req, res) {
  let idParam;
  let idCalificacion;
  let body;
  let id_actividad;
  let id_alumno;
  let nota;
  let comentario;
  let fecha_calificacion;
  let revisado;

  let datosCalificacion;
  let calificacionActualizada;

  idParam = req.params.id;
  idCalificacion = parseInt(idParam, 10);

  if (isNaN(idCalificacion)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El ID debe ser un número válido'
    });
  }

  body = req.body;

  id_actividad = body.id_actividad;
  id_alumno = body.id_alumno;
  nota = body.nota;
  comentario = body.comentario;
  fecha_calificacion = body.fecha_calificacion;
  revisado = body.revisado;

  if (
    id_actividad === undefined ||
    id_alumno === undefined ||
    nota === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_actividad, id_alumno, nota'
    });
  }

  if (
    isNaN(parseInt(id_actividad, 10)) ||
    isNaN(parseInt(id_alumno, 10)) ||
    isNaN(parseFloat(nota))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_actividad, id_alumno y nota deben ser numéricos válidos'
    });
  }

  if (
    revisado !== undefined &&
    revisado !== null &&
    ![0, 1, '0', '1', true, false].includes(revisado)
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'revisado debe ser 0/1 (false/true) si se indica'
    });
  }

  datosCalificacion = {
    id_actividad: parseInt(id_actividad, 10),
    id_alumno: parseInt(id_alumno, 10),
    nota: parseFloat(nota),
    comentario: comentario || null,
    fecha_calificacion: fecha_calificacion || null,
    revisado: (revisado === undefined || revisado === null)
      ? 0
      : (revisado === true || revisado === '1' || revisado === 1 ? 1 : 0)
  };

  try {
    calificacionActualizada = await calificacionesModel.updateCalificacion(
      idCalificacion,
      datosCalificacion
    );

    if (!calificacionActualizada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Calificación no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Calificación actualizada correctamente',
      data: calificacionActualizada
    });
  } catch (error) {
    console.error('Error en updateCalificacionHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al actualizar la calificación'
    });
  }
};

// DELETE /calificaciones/:id → elimina una calificación
deleteCalificacionHandler = async function (req, res) {
  let idParam;
  let idCalificacion;
  let eliminado;

  idParam = req.params.id;
  idCalificacion = parseInt(idParam, 10);

  if (isNaN(idCalificacion)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El ID debe ser un número válido'
    });
  }

  try {
    eliminado = await calificacionesModel.deleteCalificacion(idCalificacion);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Calificación no encontrada'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Calificación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error en deleteCalificacionHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al eliminar la calificación'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getCalificacionesHandler,
  getCalificacionByIdHandler,
  createCalificacionHandler,
  updateCalificacionHandler,
  deleteCalificacionHandler
};

