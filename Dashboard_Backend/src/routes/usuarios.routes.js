// src/routes/usuarios.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso USUARIO.
// Conecta las rutas HTTP con el controlador de usuarios,
// y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;             // Paquete express
let router;              // Router específico para /usuarios
let usuariosController;  // Controlador con la lógica de usuarios

// Handlers seguros
let safeGetUsuariosHandler;
let safeGetUsuarioByIdHandler;
let safeCreateUsuarioHandler;
let safeUpdateUsuarioHandler;
let safeDeleteUsuarioHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
usuariosController = require('../controllers/usuarios.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de usuarios no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en usuarios.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetUsuariosHandler = (
  usuariosController &&
  typeof usuariosController.getUsuariosHandler === 'function'
)
  ? usuariosController.getUsuariosHandler
  : crearFallback('getUsuariosHandler');

safeGetUsuarioByIdHandler = (
  usuariosController &&
  typeof usuariosController.getUsuarioByIdHandler === 'function'
)
  ? usuariosController.getUsuarioByIdHandler
  : crearFallback('getUsuarioByIdHandler');

safeCreateUsuarioHandler = (
  usuariosController &&
  typeof usuariosController.createUsuarioHandler === 'function'
)
  ? usuariosController.createUsuarioHandler
  : crearFallback('createUsuarioHandler');

safeUpdateUsuarioHandler = (
  usuariosController &&
  typeof usuariosController.updateUsuarioHandler === 'function'
)
  ? usuariosController.updateUsuarioHandler
  : crearFallback('updateUsuarioHandler');

safeDeleteUsuarioHandler = (
  usuariosController &&
  typeof usuariosController.deleteUsuarioHandler === 'function'
)
  ? usuariosController.deleteUsuarioHandler
  : crearFallback('deleteUsuarioHandler');

// Log de depuración
console.log('usuariosController cargado en rutas:', Object.keys(usuariosController));

// 3. DEFINICIÓN DE RUTAS

// GET /usuarios → lista todos los usuarios
router.get('/', safeGetUsuariosHandler);

// GET /usuarios/:id → obtiene un usuario por id
router.get('/:id', safeGetUsuarioByIdHandler);

// POST /usuarios → crea un nuevo usuario
router.post('/', safeCreateUsuarioHandler);

// PUT /usuarios/:id → actualiza un usuario
router.put('/:id', safeUpdateUsuarioHandler);

// DELETE /usuarios/:id → elimina un usuario
router.delete('/:id', safeDeleteUsuarioHandler);

// 4. EXPORTACIONES
module.exports = router;


