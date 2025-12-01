// src/routes/tiposActividad.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso TIPO_ACTIVIDAD.
// Conecta las rutas HTTP con el controlador de tipos de
// actividad y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;                 // Paquete express
let router;                  // Router específico para /tipos-actividad
let tiposActividadController; // Controlador con la lógica de tipos

// Handlers seguros
let safeGetTiposActividadHandler;
let safeGetTipoActividadByIdHandler;
let safeCreateTipoActividadHandler;
let safeUpdateTipoActividadHandler;
let safeDeleteTipoActividadHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
tiposActividadController = require('../controllers/tiposActividad.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de tipos de actividad no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en tiposActividad.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetTiposActividadHandler = (
  tiposActividadController &&
  typeof tiposActividadController.getTiposActividadHandler === 'function'
)
  ? tiposActividadController.getTiposActividadHandler
  : crearFallback('getTiposActividadHandler');

safeGetTipoActividadByIdHandler = (
  tiposActividadController &&
  typeof tiposActividadController.getTipoActividadByIdHandler === 'function'
)
  ? tiposActividadController.getTipoActividadByIdHandler
  : crearFallback('getTipoActividadByIdHandler');

safeCreateTipoActividadHandler = (
  tiposActividadController &&
  typeof tiposActividadController.createTipoActividadHandler === 'function'
)
  ? tiposActividadController.createTipoActividadHandler
  : crearFallback('createTipoActividadHandler');

safeUpdateTipoActividadHandler = (
  tiposActividadController &&
  typeof tiposActividadController.updateTipoActividadHandler === 'function'
)
  ? tiposActividadController.updateTipoActividadHandler
  : crearFallback('updateTipoActividadHandler');

safeDeleteTipoActividadHandler = (
  tiposActividadController &&
  typeof tiposActividadController.deleteTipoActividadHandler === 'function'
)
  ? tiposActividadController.deleteTipoActividadHandler
  : crearFallback('deleteTipoActividadHandler');

// Log de depuración
console.log(
  'tiposActividadController cargado en rutas:',
  Object.keys(tiposActividadController)
);

// 3. DEFINICIÓN DE RUTAS

// GET /tipos-actividad → lista todos los tipos
router.get('/', safeGetTiposActividadHandler);

// GET /tipos-actividad/:id → obtiene un tipo por id
router.get('/:id', safeGetTipoActividadByIdHandler);

// POST /tipos-actividad → crea un nuevo tipo
router.post('/', safeCreateTipoActividadHandler);

// PUT /tipos-actividad/:id → actualiza un tipo
router.put('/:id', safeUpdateTipoActividadHandler);

// DELETE /tipos-actividad/:id → elimina un tipo
router.delete('/:id', safeDeleteTipoActividadHandler);

// 4. EXPORTACIONES
module.exports = router;
