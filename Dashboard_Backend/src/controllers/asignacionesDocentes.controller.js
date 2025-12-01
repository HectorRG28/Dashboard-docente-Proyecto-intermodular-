// src/controllers/asignacionesDocentes.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso ASIGNACION_DOCENTE.
// Lee req/res y delega en el modelo de asignaciones de docentes.
// ----------------------------------------------------------

// 1. DECLARACIONES
let asignacionesDocentesModel;            // Modelo que habla con la tabla asignacion_docente

let getAsignacionesDocentesHandler;       // GET /asignaciones-docentes
let getAsignacionDocenteByIdHandler;      // GET /asignaciones-docentes/:id
let createAsignacionDocenteHandler;       // POST /asignaciones-docentes
let updateAsignacionDocenteHandler;       // PUT /asignaciones-docentes/:id
let deleteAsignacionDocenteHandler;       // DELETE /asignaciones-docentes/:id

// 2. ASIGNACIONES
asignacionesDocentesModel = require('../models/asignacionesDocentes.model');

// GET /asignaciones-docentes → lista todas las asignaciones
getAsignacionesDocentesHandler = async function (req, res) {
  let asignaciones;

  try {
    asignaciones = await asignacionesDocentesModel.getAllAsignacionesDocentes();

    return res.status(200).json({
      ok: true,
      data: asignaciones
    });
  } catch (error) {
    console.error('Error en getAsignacionesDocentesHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener las asignaciones de docentes'
    });
  }
};

// GET /asignaciones-docentes/:id → obtiene una asignación por id
getAsignacionDocenteByIdHandler = async function (req, res) {
  let idParam;
  let idAsignacion;
  let asignacion;

  idParam = req.params.id;
  idAsignacion = parseInt(idParam, 10);

  if (isNaN(idAsignacion)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    asignacion = await asignacionesDocentesModel.getAsignacionDocenteById(idAsignacion);

    if (!asignacion) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ninguna asignación de docente con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: asignacion
    });
  } catch (error) {
    console.error('Error en getAsignacionDocenteByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener la asignación de docente'
    });
  }
};

// POST /asignaciones-docentes → crea una nueva asignación
// Body esperado:
// {
//   "id_docente": 1,
//   "id_modulo": 2,
//   "id_grupo": 3,
//   "id_curso": 4,
//   "horas_asignadas": 4,
//   "fecha_inicio": "2024-09-15",
//   "fecha_fin": "2025-06-20"
// }
createAsignacionDocenteHandler = async function (req, res) {
  let body;
  let id_docente;
  let id_modulo;
  let id_grupo;
  let id_curso;
  let horas_asignadas;
  let fecha_inicio;
  let fecha_fin;

  let datosAsignacion;
  let nuevaAsignacion;

  body = req.body;

  id_docente = body.id_docente;
  id_modulo = body.id_modulo;
  id_grupo = body.id_grupo;
  id_curso = body.id_curso;
  horas_asignadas = body.horas_asignadas;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;

  // Validación de campos obligatorios
  if (
    id_docente === undefined ||
    id_modulo === undefined ||
    id_grupo === undefined ||
    id_curso === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_docente, id_modulo, id_grupo, id_curso'
    });
  }

  // Validación de que los IDs son números enteros
  if (
    isNaN(parseInt(id_docente, 10)) ||
    isNaN(parseInt(id_modulo, 10)) ||
    isNaN(parseInt(id_grupo, 10)) ||
    isNaN(parseInt(id_curso, 10))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_docente, id_modulo, id_grupo e id_curso deben ser números enteros válidos'
    });
  }

  // horas_asignadas es opcional, pero si viene debe ser número
  if (
    horas_asignadas !== undefined &&
    horas_asignadas !== null &&
    isNaN(parseInt(horas_asignadas, 10))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'horas_asignadas debe ser un número entero válido si se especifica'
    });
  }

  datosAsignacion = {
    id_docente: parseInt(id_docente, 10),
    id_modulo: parseInt(id_modulo, 10),
    id_grupo: parseInt(id_grupo, 10),
    id_curso: parseInt(id_curso, 10),
    horas_asignadas: horas_asignadas !== undefined && horas_asignadas !== null
      ? parseInt(horas_asignadas, 10)
      : null,
    fecha_inicio: fecha_inicio || null,
    fecha_fin: fecha_fin || null
  };

  try {
    nuevaAsignacion = await asignacionesDocentesModel.createAsignacionDocente(datosAsignacion);

    return res.status(201).json({
      ok: true,
      mensaje: 'Asignación de docente creada correctamente',
      data: nuevaAsignacion
    });
  } catch (error) {
    console.error('Error en createAsignacionDocenteHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear la asignación de docente'
    });
  }
};

// PUT /asignaciones-docentes/:id → actualiza una asignación existente
updateAsignacionDocenteHandler = async function (req, res) {
  let idParam;
  let idAsignacion;
  let body;
  let id_docente;
  let id_modulo;
  let id_grupo;
  let id_curso;
  let horas_asignadas;
  let fecha_inicio;
  let fecha_fin;

  let datosAsignacion;
  let asignacionActualizada;

  idParam = req.params.id;
  idAsignacion = parseInt(idParam, 10);

  if (isNaN(idAsignacion)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  id_docente = body.id_docente;
  id_modulo = body.id_modulo;
  id_grupo = body.id_grupo;
  id_curso = body.id_curso;
  horas_asignadas = body.horas_asignadas;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;

  if (
    id_docente === undefined ||
    id_modulo === undefined ||
    id_grupo === undefined ||
    id_curso === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_docente, id_modulo, id_grupo, id_curso'
    });
  }

  if (
    isNaN(parseInt(id_docente, 10)) ||
    isNaN(parseInt(id_modulo, 10)) ||
    isNaN(parseInt(id_grupo, 10)) ||
    isNaN(parseInt(id_curso, 10))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_docente, id_modulo, id_grupo e id_curso deben ser números enteros válidos'
    });
  }

  if (
    horas_asignadas !== undefined &&
    horas_asignadas !== null &&
    isNaN(parseInt(horas_asignadas, 10))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'horas_asignadas debe ser un número entero válido si se especifica'
    });
  }

  datosAsignacion = {
    id_docente: parseInt(id_docente, 10),
    id_modulo: parseInt(id_modulo, 10),
    id_grupo: parseInt(id_grupo, 10),
    id_curso: parseInt(id_curso, 10),
    horas_asignadas: horas_asignadas !== undefined && horas_asignadas !== null
      ? parseInt(horas_asignadas, 10)
      : null,
    fecha_inicio: fecha_inicio || null,
    fecha_fin: fecha_fin || null
  };

  try {
    asignacionActualizada = await asignacionesDocentesModel.updateAsignacionDocente(
      idAsignacion,
      datosAsignacion
    );

    if (!asignacionActualizada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ninguna asignación de docente con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Asignación de docente actualizada correctamente',
      data: asignacionActualizada
    });
  } catch (error) {
    console.error('Error en updateAsignacionDocenteHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar la asignación de docente'
    });
  }
};

// DELETE /asignaciones-docentes/:id → elimina una asignación
deleteAsignacionDocenteHandler = async function (req, res) {
  let idParam;
  let idAsignacion;
  let eliminado;

  idParam = req.params.id;
  idAsignacion = parseInt(idParam, 10);

  if (isNaN(idAsignacion)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await asignacionesDocentesModel.deleteAsignacionDocente(idAsignacion);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ninguna asignación de docente con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Asignación de docente eliminada correctamente'
    });
  } catch (error) {
    console.error('Error en deleteAsignacionDocenteHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar la asignación de docente'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getAsignacionesDocentesHandler,
  getAsignacionDocenteByIdHandler,
  createAsignacionDocenteHandler,
  updateAsignacionDocenteHandler,
  deleteAsignacionDocenteHandler
};
