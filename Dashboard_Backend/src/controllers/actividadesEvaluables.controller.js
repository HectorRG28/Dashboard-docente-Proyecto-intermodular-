// src/controllers/actividadesEvaluables.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso ACTIVIDAD_EVALUABLE.
// Lee req/res y delega en el modelo de actividades evaluables.
// ----------------------------------------------------------

// 1. DECLARACIONES
let actividadesEvaluablesModel;            // Modelo que habla con la tabla actividad_evaluable

let getActividadesEvaluablesHandler;       // GET /actividades-evaluables
let getActividadEvaluableByIdHandler;      // GET /actividades-evaluables/:id
let createActividadEvaluableHandler;       // POST /actividades-evaluables
let updateActividadEvaluableHandler;       // PUT /actividades-evaluables/:id
let deleteActividadEvaluableHandler;       // DELETE /actividades-evaluables/:id

// 2. ASIGNACIONES
actividadesEvaluablesModel = require('../models/actividadesEvaluables.model');

// GET /actividades-evaluables → lista todas las actividades
getActividadesEvaluablesHandler = async function (req, res) {
  let actividades;

  try {
    actividades = await actividadesEvaluablesModel.getAllActividadesEvaluables();

    return res.status(200).json({
      ok: true,
      data: actividades
    });
  } catch (error) {
    console.error('Error en getActividadesEvaluablesHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener las actividades evaluables'
    });
  }
};

// GET /actividades-evaluables/:id → obtiene una actividad por id
getActividadEvaluableByIdHandler = async function (req, res) {
  let idParam;
  let idActividad;
  let actividad;

  idParam = req.params.id;
  idActividad = parseInt(idParam, 10);

  if (isNaN(idActividad)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    actividad = await actividadesEvaluablesModel.getActividadEvaluableById(idActividad);

    if (!actividad) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ninguna actividad evaluable con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: actividad
    });
  } catch (error) {
    console.error('Error en getActividadEvaluableByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener la actividad evaluable'
    });
  }
};

// POST /actividades-evaluables → crea una nueva actividad
// Body esperado (ejemplo):
// {
//   "id_asignacion": 1,
//   "id_tipo": 2,
//   "id_estado": 1,
//   "id_periodo": 3,          // opcional (puede ser null)
//   "creado_por": 1,
//   "titulo": "Examen UD1",
//   "descripcion": "Examen sobre los temas 1 y 2",
//   "fecha_inicio": "2025-02-10 10:00:00",
//   "fecha_fin": "2025-02-10 12:00:00",
//   "peso": 30.5              // opcional
// }
createActividadEvaluableHandler = async function (req, res) {
  let body;
  let id_asignacion;
  let id_tipo;
  let id_estado;
  let id_periodo;
  let creado_por;
  let titulo;
  let descripcion;
  let fecha_inicio;
  let fecha_fin;
  let peso;

  let datosActividad;
  let nuevaActividad;

  body = req.body;

  id_asignacion = body.id_asignacion;
  id_tipo = body.id_tipo;
  id_estado = body.id_estado;
  id_periodo = body.id_periodo;
  creado_por = body.creado_por;
  titulo = body.titulo;
  descripcion = body.descripcion;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;
  peso = body.peso;

  // Validación de campos obligatorios
  if (
    id_asignacion === undefined ||
    id_tipo === undefined ||
    id_estado === undefined ||
    creado_por === undefined ||
    titulo === undefined ||
    fecha_inicio === undefined ||
    fecha_fin === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_asignacion, id_tipo, id_estado, creado_por, titulo, fecha_inicio, fecha_fin'
    });
  }

  // Validación de IDs como enteros
  if (
    isNaN(parseInt(id_asignacion, 10)) ||
    isNaN(parseInt(id_tipo, 10)) ||
    isNaN(parseInt(id_estado, 10)) ||
    isNaN(parseInt(creado_por, 10)) ||
    (id_periodo !== undefined &&
      id_periodo !== null &&
      isNaN(parseInt(id_periodo, 10)))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_asignacion, id_tipo, id_estado, creado_por (y id_periodo si se indica) deben ser números enteros válidos'
    });
  }

  // peso opcional, pero si viene debe ser número
  if (
    peso !== undefined &&
    peso !== null &&
    isNaN(parseFloat(peso))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'peso debe ser numérico (decimal) si se especifica'
    });
  }

  datosActividad = {
    id_asignacion: parseInt(id_asignacion, 10),
    id_tipo: parseInt(id_tipo, 10),
    id_estado: parseInt(id_estado, 10),
    id_periodo: (id_periodo !== undefined && id_periodo !== null)
      ? parseInt(id_periodo, 10)
      : null,
    creado_por: parseInt(creado_por, 10),
    titulo: titulo,
    descripcion: descripcion || null,
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin,
    peso: (peso !== undefined && peso !== null)
      ? parseFloat(peso)
      : null
  };

  try {
    nuevaActividad = await actividadesEvaluablesModel.createActividadEvaluable(datosActividad);

    return res.status(201).json({
      ok: true,
      mensaje: 'Actividad evaluable creada correctamente',
      data: nuevaActividad
    });
  } catch (error) {
    console.error('Error en createActividadEvaluableHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear la actividad evaluable'
    });
  }
};

// PUT /actividades-evaluables/:id → actualiza una actividad existente
updateActividadEvaluableHandler = async function (req, res) {
  let idParam;
  let idActividad;
  let body;
  let id_asignacion;
  let id_tipo;
  let id_estado;
  let id_periodo;
  let creado_por;
  let titulo;
  let descripcion;
  let fecha_inicio;
  let fecha_fin;
  let peso;

  let datosActividad;
  let actividadActualizada;

  idParam = req.params.id;
  idActividad = parseInt(idParam, 10);

  if (isNaN(idActividad)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  id_asignacion = body.id_asignacion;
  id_tipo = body.id_tipo;
  id_estado = body.id_estado;
  id_periodo = body.id_periodo;
  creado_por = body.creado_por;
  titulo = body.titulo;
  descripcion = body.descripcion;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;
  peso = body.peso;

  if (
    id_asignacion === undefined ||
    id_tipo === undefined ||
    id_estado === undefined ||
    creado_por === undefined ||
    titulo === undefined ||
    fecha_inicio === undefined ||
    fecha_fin === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_asignacion, id_tipo, id_estado, creado_por, titulo, fecha_inicio, fecha_fin'
    });
  }

  if (
    isNaN(parseInt(id_asignacion, 10)) ||
    isNaN(parseInt(id_tipo, 10)) ||
    isNaN(parseInt(id_estado, 10)) ||
    isNaN(parseInt(creado_por, 10)) ||
    (id_periodo !== undefined &&
      id_periodo !== null &&
      isNaN(parseInt(id_periodo, 10)))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_asignacion, id_tipo, id_estado, creado_por (y id_periodo si se indica) deben ser números enteros válidos'
    });
  }

  if (
    peso !== undefined &&
    peso !== null &&
    isNaN(parseFloat(peso))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'peso debe ser numérico (decimal) si se especifica'
    });
  }

  datosActividad = {
    id_asignacion: parseInt(id_asignacion, 10),
    id_tipo: parseInt(id_tipo, 10),
    id_estado: parseInt(id_estado, 10),
    id_periodo: (id_periodo !== undefined && id_periodo !== null)
      ? parseInt(id_periodo, 10)
      : null,
    creado_por: parseInt(creado_por, 10),
    titulo: titulo,
    descripcion: descripcion || null,
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin,
    peso: (peso !== undefined && peso !== null)
      ? parseFloat(peso)
      : null
  };

  try {
    actividadActualizada = await actividadesEvaluablesModel.updateActividadEvaluable(
      idActividad,
      datosActividad
    );

    if (!actividadActualizada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ninguna actividad evaluable con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Actividad evaluable actualizada correctamente',
      data: actividadActualizada
    });
  } catch (error) {
    console.error('Error en updateActividadEvaluableHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar la actividad evaluable'
    });
  }
};

// DELETE /actividades-evaluables/:id → elimina una actividad
deleteActividadEvaluableHandler = async function (req, res) {
  let idParam;
  let idActividad;
  let eliminado;

  idParam = req.params.id;
  idActividad = parseInt(idParam, 10);

  if (isNaN(idActividad)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await actividadesEvaluablesModel.deleteActividadEvaluable(idActividad);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ninguna actividad evaluable con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Actividad evaluable eliminada correctamente'
    });
  } catch (error) {
    console.error('Error en deleteActividadEvaluableHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar la actividad evaluable'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getActividadesEvaluablesHandler,
  getActividadEvaluableByIdHandler,
  createActividadEvaluableHandler,
  updateActividadEvaluableHandler,
  deleteActividadEvaluableHandler
};
