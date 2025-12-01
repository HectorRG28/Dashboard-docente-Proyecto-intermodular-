// src/controllers/grupos.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso GRUPO.
// Lee req/res y delega en el modelo de grupos.
// ----------------------------------------------------------

// 1. DECLARACIONES
let gruposModel;            // Modelo que habla con la tabla grupo

let getGruposHandler;       // GET /grupos
let getGrupoByIdHandler;    // GET /grupos/:id
let createGrupoHandler;     // POST /grupos
let updateGrupoHandler;     // PUT /grupos/:id
let deleteGrupoHandler;     // DELETE /grupos/:id

// 2. ASIGNACIONES
gruposModel = require('../models/grupos.model');

// GET /grupos → lista todos los grupos
getGruposHandler = async function (req, res) {
  let grupos;

  try {
    grupos = await gruposModel.getAllGrupos();

    return res.status(200).json({
      ok: true,
      data: grupos
    });
  } catch (error) {
    console.error('Error en getGruposHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los grupos'
    });
  }
};

// GET /grupos/:id → obtiene un grupo por id
getGrupoByIdHandler = async function (req, res) {
  let idParam;
  let idGrupo;
  let grupo;

  idParam = req.params.id;
  idGrupo = parseInt(idParam, 10);

  if (isNaN(idGrupo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    grupo = await gruposModel.getGrupoById(idGrupo);

    if (!grupo) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún grupo con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: grupo
    });
  } catch (error) {
    console.error('Error en getGrupoByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el grupo'
    });
  }
};

// POST /grupos → crea un nuevo grupo
// Espera un body como:
// {
//   "id_curso": 1,
//   "nombre_grupo": "1ºDAW-A"
// }
createGrupoHandler = async function (req, res) {
  let body;
  let id_curso;
  let nombre_grupo;
  let datosGrupo;
  let nuevoGrupo;

  body = req.body;

  id_curso = body.id_curso;
  nombre_grupo = body.nombre_grupo;

  if (
    id_curso === undefined ||
    nombre_grupo === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_curso, nombre_grupo'
    });
  }

  if (isNaN(parseInt(id_curso, 10))) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_curso debe ser un número entero válido'
    });
  }

  datosGrupo = {
    id_curso: parseInt(id_curso, 10),
    nombre_grupo: nombre_grupo
  };

  try {
    nuevoGrupo = await gruposModel.createGrupo(datosGrupo);

    return res.status(201).json({
      ok: true,
      mensaje: 'Grupo creado correctamente',
      data: nuevoGrupo
    });
  } catch (error) {
    console.error('Error en createGrupoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el grupo'
    });
  }
};

// PUT /grupos/:id → actualiza un grupo existente
updateGrupoHandler = async function (req, res) {
  let idParam;
  let idGrupo;
  let body;
  let id_curso;
  let nombre_grupo;
  let datosGrupo;
  let grupoActualizado;

  idParam = req.params.id;
  idGrupo = parseInt(idParam, 10);

  if (isNaN(idGrupo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  id_curso = body.id_curso;
  nombre_grupo = body.nombre_grupo;

  if (
    id_curso === undefined ||
    nombre_grupo === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: id_curso, nombre_grupo'
    });
  }

  if (isNaN(parseInt(id_curso, 10))) {
    return res.status(400).json({
      ok: false,
      mensaje: 'id_curso debe ser un número entero válido'
    });
  }

  datosGrupo = {
    id_curso: parseInt(id_curso, 10),
    nombre_grupo: nombre_grupo
  };

  try {
    grupoActualizado = await gruposModel.updateGrupo(idGrupo, datosGrupo);

    if (!grupoActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún grupo con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Grupo actualizado correctamente',
      data: grupoActualizado
    });
  } catch (error) {
    console.error('Error en updateGrupoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el grupo'
    });
  }
};

// DELETE /grupos/:id → elimina un grupo
deleteGrupoHandler = async function (req, res) {
  let idParam;
  let idGrupo;
  let eliminado;

  idParam = req.params.id;
  idGrupo = parseInt(idParam, 10);

  if (isNaN(idGrupo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await gruposModel.deleteGrupo(idGrupo);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún grupo con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Grupo eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteGrupoHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el grupo'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getGruposHandler,
  getGrupoByIdHandler,
  createGrupoHandler,
  updateGrupoHandler,
  deleteGrupoHandler
};
