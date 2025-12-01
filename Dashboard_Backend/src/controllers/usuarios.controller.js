// src/controllers/usuarios.controller.js
// ----------------------------------------------------------
// Controladores (handlers HTTP) para el recurso USUARIO.
// Aquí se leen los datos de req/res y se llama al modelo.
// ----------------------------------------------------------

// 1. DECLARACIONES
let usuariosModel;           // Modelo que habla con la tabla usuario

let getUsuariosHandler;      // GET /usuarios
let getUsuarioByIdHandler;   // GET /usuarios/:id
let createUsuarioHandler;    // POST /usuarios
let updateUsuarioHandler;    // PUT /usuarios/:id
let deleteUsuarioHandler;    // DELETE /usuarios/:id

// 2. ASIGNACIONES
usuariosModel = require('../models/usuarios.model');

// GET /usuarios → lista todos los usuarios
getUsuariosHandler = async function (req, res) {
  let usuarios;

  try {
    usuarios = await usuariosModel.getAllUsuarios();

    return res.status(200).json({
      ok: true,
      data: usuarios
    });
  } catch (error) {
    console.error('Error en getUsuariosHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener los usuarios'
    });
  }
};

// GET /usuarios/:id → obtiene un usuario por id
getUsuarioByIdHandler = async function (req, res) {
  let idParam;
  let idUsuario;
  let usuario;

  idParam = req.params.id;
  idUsuario = parseInt(idParam, 10);

  if (isNaN(idUsuario)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    usuario = await usuariosModel.getUsuarioById(idUsuario);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se encontró ningún usuario con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error en getUsuarioByIdHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el usuario'
    });
  }
};

// POST /usuarios → crea un nuevo usuario
createUsuarioHandler = async function (req, res) {
  let body;
  let nombre;
  let apellidos;
  let email;
  let rol;
  let estado;
  let datosUsuario;
  let nuevoUsuario;

  body = req.body;

  nombre = body.nombre;
  apellidos = body.apellidos;
  email = body.email;
  rol = body.rol;
  estado = body.estado;

  if (
    nombre === undefined ||
    apellidos === undefined ||
    email === undefined ||
    rol === undefined ||
    estado === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: nombre, apellidos, email, rol, estado'
    });
  }

  datosUsuario = {
    nombre: nombre,
    apellidos: apellidos,
    email: email,
    rol: rol,
    estado: estado
  };

  try {
    nuevoUsuario = await usuariosModel.createUsuario(datosUsuario);

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado correctamente',
      data: nuevoUsuario
    });
  } catch (error) {
    console.error('Error en createUsuarioHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al crear el usuario'
    });
  }
};

// PUT /usuarios/:id → actualiza un usuario
updateUsuarioHandler = async function (req, res) {
  let idParam;
  let idUsuario;
  let body;
  let nombre;
  let apellidos;
  let email;
  let rol;
  let estado;
  let datosUsuario;
  let usuarioActualizado;

  idParam = req.params.id;
  idUsuario = parseInt(idParam, 10);

  if (isNaN(idUsuario)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  body = req.body;

  nombre = body.nombre;
  apellidos = body.apellidos;
  email = body.email;
  rol = body.rol;
  estado = body.estado;

  if (
    nombre === undefined ||
    apellidos === undefined ||
    email === undefined ||
    rol === undefined ||
    estado === undefined
  ) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Faltan campos obligatorios: nombre, apellidos, email, rol, estado'
    });
  }

  datosUsuario = {
    nombre: nombre,
    apellidos: apellidos,
    email: email,
    rol: rol,
    estado: estado
  };

  try {
    usuarioActualizado = await usuariosModel.updateUsuario(idUsuario, datosUsuario);

    if (!usuarioActualizado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún usuario con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario actualizado correctamente',
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error en updateUsuarioHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al actualizar el usuario'
    });
  }
};

// DELETE /usuarios/:id → elimina un usuario
deleteUsuarioHandler = async function (req, res) {
  let idParam;
  let idUsuario;
  let eliminado;

  idParam = req.params.id;
  idUsuario = parseInt(idParam, 10);

  if (isNaN(idUsuario)) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El parámetro id debe ser un número entero válido'
    });
  }

  try {
    eliminado = await usuariosModel.deleteUsuario(idUsuario);

    if (!eliminado) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No existe ningún usuario con ese id'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en deleteUsuarioHandler:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al eliminar el usuario'
    });
  }
};

// 3. EXPORTACIONES
module.exports = {
  getUsuariosHandler,
  getUsuarioByIdHandler,
  createUsuarioHandler,
  updateUsuarioHandler,
  deleteUsuarioHandler
};

