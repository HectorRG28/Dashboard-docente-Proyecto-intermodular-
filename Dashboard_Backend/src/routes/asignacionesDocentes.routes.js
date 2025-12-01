// src/routes/asignacionesDocentes.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso ASIGNACION_DOCENTE.
// Conecta las rutas HTTP con el controlador de asignaciones
// de docentes y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;                        // Paquete express
let router;                         // Router específico para /asignaciones-docentes
let asignacionesDocentesController; // Controlador con la lógica de asignaciones

// Handlers seguros
let safeGetAsignacionesDocentesHandler;
let safeGetAsignacionDocenteByIdHandler;
let safeCreateAsignacionDocenteHandler;
let safeUpdateAsignacionDocenteHandler;
let safeDeleteAsignacionDocenteHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
asignacionesDocentesController = require('../controllers/asignacionesDocentes.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de asignaciones de docentes no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en asignacionesDocentes.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetAsignacionesDocentesHandler = (
  asignacionesDocentesController &&
  typeof asignacionesDocentesController.getAsignacionesDocentesHandler === 'function'
)
  ? asignacionesDocentesController.getAsignacionesDocentesHandler
  : crearFallback('getAsignacionesDocentesHandler');

safeGetAsignacionDocenteByIdHandler = (
  asignacionesDocentesController &&
  typeof asignacionesDocentesController.getAsignacionDocenteByIdHandler === 'function'
)
  ? asignacionesDocentesController.getAsignacionDocenteByIdHandler
  : crearFallback('getAsignacionDocenteByIdHandler');

safeCreateAsignacionDocenteHandler = (
  asignacionesDocentesController &&
  typeof asignacionesDocentesController.createAsignacionDocenteHandler === 'function'
)
  ? asignacionesDocentesController.createAsignacionDocenteHandler
  : crearFallback('createAsignacionDocenteHandler');

safeUpdateAsignacionDocenteHandler = (
  asignacionesDocentesController &&
  typeof asignacionesDocentesController.updateAsignacionDocenteHandler === 'function'
)
  ? asignacionesDocentesController.updateAsignacionDocenteHandler
  : crearFallback('updateAsignacionDocenteHandler');

safeDeleteAsignacionDocenteHandler = (
  asignacionesDocentesController &&
  typeof asignacionesDocentesController.deleteAsignacionDocenteHandler === 'function'
)
  ? asignacionesDocentesController.deleteAsignacionDocenteHandler
  : crearFallback('deleteAsignacionDocenteHandler');

// Log de depuración para ver qué exporta el controlador
console.log(
  'asignacionesDocentesController cargado en rutas:',
  Object.keys(asignacionesDocentesController)
);

// 3. DEFINICIÓN DE RUTAS

// GET /asignaciones-docentes → lista todas las asignaciones
router.get('/', safeGetAsignacionesDocentesHandler);

// GET /asignaciones-docentes/:id → obtiene una asignación por id
router.get('/:id', safeGetAsignacionDocenteByIdHandler);

// POST /asignaciones-docentes → crea una nueva asignación
router.post('/', safeCreateAsignacionDocenteHandler);

// PUT /asignaciones-docentes/:id → actualiza una asignación
router.put('/:id', safeUpdateAsignacionDocenteHandler);

// DELETE /asignaciones-docentes/:id → elimina una asignación
router.delete('/:id', safeDeleteAsignacionDocenteHandler);

// 4. EXPORTACIONES
module.exports = router;
