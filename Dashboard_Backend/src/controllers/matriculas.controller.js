// src/controllers/matriculas.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso MATRICULA.
// Lee req/res y delega en el modelo de matrículas.
// ----------------------------------------------------------

// 1. DECLARACIONES
let matriculasModel;            // Modelo que habla con la tabla matricula

let getMatriculasHandler;       // GET /matriculas
let getMatriculaByIdHandler;    // GET /matriculas/:id
let createMatriculaHandler;     // POST /matriculas
let updateMatriculaHandler;     // PUT /matriculas/:id
let deleteMatriculaHandler;     // DELETE /matriculas/:id

// 2. ASIGNACIONES
matriculasModel = require('../models/matriculas.model');

// GET /matriculas → lista todas las matrículas
getMatriculasHandler = async function (req, res) {
  let matriculas;

  try {
    matriculas = await matriculasModel.getAllMatriculas();

    return res.status(200).json({
      ok: true,
      data: matriculas
    });
  } catch (error) {
    console.error('Error en getMatriculasHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener las matrículas'
    });
  }
};

// GET /matriculas/:id → obtiene una matrícula por id
getMatriculaByIdHandler = async function (req, res) {
  let idParam;
  let idMatricula;
  let matricula;

  idParam = req.params.id;
  idMatricula = parseInt(idParam, 10);

  if (isNaN(idMatricula)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    matricula = await matriculasModel.getMatriculaById(idMatricula);

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ninguna matrícula con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: matricula
    });
  } catch (error) {
    console.error('Error en getMatriculaByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener la matrícula'
    });
  }
};

// POST /matriculas → crea una nueva matrícula
// Body esperado:
// {
//   "id_alumno": 10,
//   "id_grupo": 3,
//   "id_curso": 1,
//   "fecha_matricula": "2024-09-10"   // opcional
// }
createMatriculaHandler = async function (req, res) {
  let body;
  let id_alumno;
  let id_grupo;
  let id_curso;
  let fecha_matricula;
  let datosMatricula;
  let nuevaMatricula;

  body = req.body;

  id_alumno = body.id_alumno;
  id_grupo = body.id_grupo;
  id_curso = body.id_curso;
  fecha_matricula = body.fecha_matricula;

  // Validación de campos obligatorios
  if (
    id_alumno === undefined ||
    id_grupo === undefined ||
    id_curso === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_alumno, id_grupo, id_curso'
    });
  }

  // Validación de que los IDs son números enteros
  if (
    isNaN(parseInt(id_alumno, 10)) ||
    isNaN(parseInt(id_grupo, 10)) ||
    isNaN(parseInt(id_curso, 10))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_alumno, id_grupo e id_curso deben ser números enteros válidos'
    });
  }

  datosMatricula = {
    id_alumno: parseInt(id_alumno, 10),
    id_grupo: parseInt(id_grupo, 10),
    id_curso: parseInt(id_curso, 10),
    fecha_matricula: fecha_matricula || null
  };

  try {
    nuevaMatricula = await matriculasModel.createMatricula(datosMatricula);

    return res.status(201).json({
      ok: true,
      mensaje: 'Matrícula creada correctamente',
      data: nuevaMatricula
    });
  } catch (error) {
    console.error('Error en createMatriculaHandler:', error);

    // Aquí podríamos distinguir error de índice único (duplicada),
    // pero de momento devolvemos 500 genérico.
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear la matrícula'
    });
  }
};

// PUT /matriculas/:id → actualiza una matrícula existente
updateMatriculaHandler = async function (req, res) {
  let idParam;
  let idMatricula;
  let body;
  let id_alumno;
  let id_grupo;
  let id_curso;
  let fecha_matricula;
  let datosMatricula;
  let matriculaActualizada;

  idParam = req.params.id;
  idMatricula = parseInt(idParam, 10);

  if (isNaN(idMatricula)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  id_alumno = body.id_alumno;
  id_grupo = body.id_grupo;
  id_curso = body.id_curso;
  fecha_matricula = body.fecha_matricula;

  if (
    id_alumno === undefined ||
    id_grupo === undefined ||
    id_curso === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_alumno, id_grupo, id_curso'
    });
  }

  if (
    isNaN(parseInt(id_alumno, 10)) ||
    isNaN(parseInt(id_grupo, 10)) ||
    isNaN(parseInt(id_curso, 10))
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_alumno, id_grupo e id_curso deben ser números enteros válidos'
    });
  }

  datosMatricula = {
    id_alumno: parseInt(id_alumno, 10),
    id_grupo: parseInt(id_grupo, 10),
    id_curso: parseInt(id_curso, 10),
    fecha_matricula: fecha_matricula || null
  };

  try {
    matriculaActualizada = await matriculasModel.updateMatricula(idMatricula, datosMatricula);

    if (!matriculaActualizada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ninguna matrícula con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Matrícula actualizada correctamente',
      data: matriculaActualizada
    });
  } catch (error) {
    console.error('Error en updateMatriculaHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar la matrícula'
    });
  }
};

// DELETE /matriculas/:id → elimina una matrícula
deleteMatriculaHandler = async function (req, res) {
  let idParam;
  let idMatricula;
  let eliminado;

  idParam = req.params.id;
  idMatricula = parseInt(idParam, 10);

  if (isNaN(idMatricula)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await matriculasModel.deleteMatricula(idMatricula);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ninguna matrícula con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Matrícula eliminada correctamente'
    });
  } catch (error) {
    console.error('Error en deleteMatriculaHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar la matrícula'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getMatriculasHandler,
  getMatriculaByIdHandler,
  createMatriculaHandler,
  updateMatriculaHandler,
  deleteMatriculaHandler
};
