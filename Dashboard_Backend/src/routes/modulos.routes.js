// src/routes/modulos.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso MODULO.
// Conecta las rutas HTTP con el controlador de módulos,
// y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;             // Paquete express
let router;              // Router específico para /modulos
let modulosController;   // Controlador con la lógica de módulos

// Handlers seguros (por si el controlador no exporta algo bien)
let safeGetModulosHandler;
let safeGetModuloByIdHandler;
let safeCreateModuloHandler;
let safeUpdateModuloHandler;
let safeDeleteModuloHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
modulosController = require('../controllers/modulos.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de módulos no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en modulos.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetModulosHandler = (
  modulosController &&
  typeof modulosController.getModulosHandler === 'function'
)
  ? modulosController.getModulosHandler
  : crearFallback('getModulosHandler');

safeGetModuloByIdHandler = (
  modulosController &&
  typeof modulosController.getModuloByIdHandler === 'function'
)
  ? modulosController.getModuloByIdHandler
  : crearFallback('getModuloByIdHandler');

safeCreateModuloHandler = (
  modulosController &&
  typeof modulosController.createModuloHandler === 'function'
)
  ? modulosController.createModuloHandler
  : crearFallback('createModuloHandler');

safeUpdateModuloHandler = (
  modulosController &&
  typeof modulosController.updateModuloHandler === 'function'
)
  ? modulosController.updateModuloHandler
  : crearFallback('updateModuloHandler');

safeDeleteModuloHandler = (
  modulosController &&
  typeof modulosController.deleteModuloHandler === 'function'
)
  ? modulosController.deleteModuloHandler
  : crearFallback('deleteModuloHandler');

// Log de depuración para ver qué exporta el controlador
console.log(
  'modulosController cargado en rutas:',
  Object.keys(modulosController)
);

// 3. DEFINICIÓN DE RUTAS

// GET /modulos → lista todos los módulos
router.get('/', safeGetModulosHandler);

// GET /modulos/:id → obtiene un módulo por id
router.get('/:id', safeGetModuloByIdHandler);

// POST /modulos → crea un nuevo módulo
router.post('/', safeCreateModuloHandler);

// PUT /modulos/:id → actualiza un módulo
router.put('/:id', safeUpdateModuloHandler);

// DELETE /modulos/:id → elimina un módulo
router.delete('/:id', safeDeleteModuloHandler);

// 4. EXPORTACIONES
module.exports = router;
