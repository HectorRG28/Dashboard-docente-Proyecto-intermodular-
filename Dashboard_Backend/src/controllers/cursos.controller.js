// src/controllers/cursos.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso CURSO_ACADEMICO.
// ----------------------------------------------------------

// 1. DECLARACIONES
let cursosModel;            // Modelo que habla con la tabla curso_academico

let getCursosHandler;       // GET /cursos
let getCursoByIdHandler;    // GET /cursos/:id
let createCursoHandler;     // POST /cursos
let updateCursoHandler;     // PUT /cursos/:id
let deleteCursoHandler;     // DELETE /cursos/:id

// 2. ASIGNACIONES
cursosModel = require('../models/cursos.model');

// GET /cursos → lista todos los cursos académicos
getCursosHandler = async function (req, res) {
  let cursos;

  try {
    cursos = await cursosModel.getAllCursos();

    return res.status(200).json({
      ok: true,
      data: cursos
    });
  } catch (error) {
    console.error('Error en getCursosHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los cursos académicos'
    });
  }
};

// GET /cursos/:id → obtiene un curso académico por id
getCursoByIdHandler = async function (req, res) {
  let idParam;
  let idCurso;
  let curso;

  idParam = req.params.id;
  idCurso = parseInt(idParam, 10);

  if (isNaN(idCurso)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    curso = await cursosModel.getCursoById(idCurso);

    if (!curso) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún curso académico con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: curso
    });
  } catch (error) {
    console.error('Error en getCursoByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el curso académico'
    });
  }
};

// POST /cursos → crea un nuevo curso académico
createCursoHandler = async function (req, res) {
  let body;
  let nombre_curso;
  let fecha_inicio;
  let fecha_fin;
  let estado;
  let datosCurso;
  let nuevoCurso;

  body = req.body;

  nombre_curso = body.nombre_curso;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;
  estado = body.estado;

  if (
    nombre_curso === undefined ||
    fecha_inicio === undefined ||
    fecha_fin === undefined ||
    estado === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: nombre_curso, fecha_inicio, fecha_fin, estado'
    });
  }

  datosCurso = {
    nombre_curso: nombre_curso,
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin,
    estado: estado
  };

  try {
    nuevoCurso = await cursosModel.createCurso(datosCurso);

    return res.status(201).json({
      ok: true,
      mensaje: 'Curso académico creado correctamente',
      data: nuevoCurso
    });
  } catch (error) {
    console.error('Error en createCursoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el curso académico'
    });
  }
};

// PUT /cursos/:id → actualiza un curso académico existente
updateCursoHandler = async function (req, res) {
  let idParam;
  let idCurso;
  let body;
  let nombre_curso;
  let fecha_inicio;
  let fecha_fin;
  let estado;
  let datosCurso;
  let cursoActualizado;

  idParam = req.params.id;
  idCurso = parseInt(idParam, 10);

  if (isNaN(idCurso)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  nombre_curso = body.nombre_curso;
  fecha_inicio = body.fecha_inicio;
  fecha_fin = body.fecha_fin;
  estado = body.estado;

  if (
    nombre_curso === undefined ||
    fecha_inicio === undefined ||
    fecha_fin === undefined ||
    estado === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: nombre_curso, fecha_inicio, fecha_fin, estado'
    });
  }

  datosCurso = {
    nombre_curso: nombre_curso,
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin,
    estado: estado
  };

  try {
    cursoActualizado = await cursosModel.updateCurso(idCurso, datosCurso);

    if (!cursoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún curso académico con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Curso académico actualizado correctamente',
      data: cursoActualizado
    });
  } catch (error) {
    console.error('Error en updateCursoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el curso académico'
    });
  }
};

// DELETE /cursos/:id → elimina un curso académico
deleteCursoHandler = async function (req, res) {
  let idParam;
  let idCurso;
  let eliminado;

  idParam = req.params.id;
  idCurso = parseInt(idParam, 10);

  if (isNaN(idCurso)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await cursosModel.deleteCurso(idCurso);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún curso académico con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Curso académico eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteCursoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el curso académico'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getCursosHandler,
  getCursoByIdHandler,
  createCursoHandler,
  updateCursoHandler,
  deleteCursoHandler
};





