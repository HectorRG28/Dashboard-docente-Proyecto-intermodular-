// src/controllers/modulos.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso MODULO.
// Lee req/res y delega en el modelo de módulos.
// ----------------------------------------------------------

// 1. DECLARACIONES
let modulosModel;            // Modelo que habla con la tabla modulo

let getModulosHandler;       // GET /modulos
let getModuloByIdHandler;    // GET /modulos/:id
let createModuloHandler;     // POST /modulos
let updateModuloHandler;     // PUT /modulos/:id
let deleteModuloHandler;     // DELETE /modulos/:id

// 2. ASIGNACIONES
modulosModel = require('../models/modulos.model');

// GET /modulos → lista todos los módulos
getModulosHandler = async function (req, res) {
  let modulos;

  try {
    modulos = await modulosModel.getAllModulos();

    return res.status(200).json({
      ok: true,
      data: modulos
    });
  } catch (error) {
    console.error('Error en getModulosHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los módulos'
    });
  }
};

// GET /modulos/:id → obtiene un módulo por id
getModuloByIdHandler = async function (req, res) {
  let idParam;
  let idModulo;
  let modulo;

  idParam = req.params.id;
  idModulo = parseInt(idParam, 10);

  if (isNaN(idModulo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    modulo = await modulosModel.getModuloById(idModulo);

    if (!modulo) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún módulo con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: modulo
    });
  } catch (error) {
    console.error('Error en getModuloByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el módulo'
    });
  }
};

// POST /modulos → crea un nuevo módulo
// Body esperado:
// {
//   "nombre_modulo": "Programación",
//   "codigo_modulo": "PRG-1",
//   "horas_totales": 256
// }
createModuloHandler = async function (req, res) {
  let body;
  let nombre_modulo;
  let codigo_modulo;
  let horas_totales;
  let datosModulo;
  let nuevoModulo;

  body = req.body;

  nombre_modulo = body.nombre_modulo;
  codigo_modulo = body.codigo_modulo;
  horas_totales = body.horas_totales;

  if (
    nombre_modulo === undefined ||
    codigo_modulo === undefined ||
    horas_totales === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: nombre_modulo, codigo_modulo, horas_totales'
    });
  }

  if (isNaN(parseInt(horas_totales, 10))) {
    return res.status(400).json({
      ok: false,
      mensaje: 'horas_totales debe ser un número entero válido'
    });
  }

  datosModulo = {
    nombre_modulo: nombre_modulo,
    codigo_modulo: codigo_modulo,
    horas_totales: parseInt(horas_totales, 10)
  };

  try {
    nuevoModulo = await modulosModel.createModulo(datosModulo);

    return res.status(201).json({
      ok: true,
      mensaje: 'Módulo creado correctamente',
      data: nuevoModulo
    });
  } catch (error) {
    console.error('Error en createModuloHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el módulo'
    });
  }
};

// PUT /modulos/:id → actualiza un módulo existente
updateModuloHandler = async function (req, res) {
  let idParam;
  let idModulo;
  let body;
  let nombre_modulo;
  let codigo_modulo;
  let horas_totales;
  let datosModulo;
  let moduloActualizado;

  idParam = req.params.id;
  idModulo = parseInt(idParam, 10);

  if (isNaN(idModulo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  nombre_modulo = body.nombre_modulo;
  codigo_modulo = body.codigo_modulo;
  horas_totales = body.horas_totales;

  if (
    nombre_modulo === undefined ||
    codigo_modulo === undefined ||
    horas_totales === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: nombre_modulo, codigo_modulo, horas_totales'
    });
  }

  if (isNaN(parseInt(horas_totales, 10))) {
    return res.status(400).json({
      ok: false,
      mensaje: 'horas_totales debe ser un número entero válido'
    });
  }

  datosModulo = {
    nombre_modulo: nombre_modulo,
    codigo_modulo: codigo_modulo,
    horas_totales: parseInt(horas_totales, 10)
  };

  try {
    moduloActualizado = await modulosModel.updateModulo(idModulo, datosModulo);

    if (!moduloActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún módulo con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Módulo actualizado correctamente',
      data: moduloActualizado
    });
  } catch (error) {
    console.error('Error en updateModuloHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el módulo'
    });
  }
};

// DELETE /modulos/:id → elimina un módulo
deleteModuloHandler = async function (req, res) {
  let idParam;
  let idModulo;
  let eliminado;

  idParam = req.params.id;
  idModulo = parseInt(idParam, 10);

  if (isNaN(idModulo)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await modulosModel.deleteModulo(idModulo);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún módulo con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Módulo eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteModuloHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el módulo'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getModulosHandler,
  getModuloByIdHandler,
  createModuloHandler,
  updateModuloHandler,
  deleteModuloHandler
};
