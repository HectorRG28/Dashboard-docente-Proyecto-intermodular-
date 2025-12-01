// src/routes/estadosActividad.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso ESTADO_ACTIVIDAD.
// Conecta las rutas HTTP con el controlador de estados
// de actividad y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;                    // Paquete express
let router;                     // Router específico para /estados-actividad
let estadosActividadController; // Controlador con la lógica de estados

// Handlers seguros
let safeGetEstadosActividadHandler;
let safeGetEstadoActividadByIdHandler;
let safeCreateEstadoActividadHandler;
let safeUpdateEstadoActividadHandler;
let safeDeleteEstadoActividadHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
estadosActividadController = require('../controllers/estadosActividad.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de estados de actividad no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en estadosActividad.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetEstadosActividadHandler = (
  estadosActividadController &&
  typeof estadosActividadController.getEstadosActividadHandler === 'function'
)
  ? estadosActividadController.getEstadosActividadHandler
  : crearFallback('getEstadosActividadHandler');

safeGetEstadoActividadByIdHandler = (
  estadosActividadController &&
  typeof estadosActividadController.getEstadoActividadByIdHandler === 'function'
)
  ? estadosActividadController.getEstadoActividadByIdHandler
  : crearFallback('getEstadoActividadByIdHandler');

safeCreateEstadoActividadHandler = (
  estadosActividadController &&
  typeof estadosActividadController.createEstadoActividadHandler === 'function'
)
  ? estadosActividadController.createEstadoActividadHandler
  : crearFallback('createEstadoActividadHandler');

safeUpdateEstadoActividadHandler = (
  estadosActividadController &&
  typeof estadosActividadController.updateEstadoActividadHandler === 'function'
)
  ? estadosActividadController.updateEstadoActividadHandler
  : crearFallback('updateEstadoActividadHandler');

safeDeleteEstadoActividadHandler = (
  estadosActividadController &&
  typeof estadosActividadController.deleteEstadoActividadHandler === 'function'
)
  ? estadosActividadController.deleteEstadoActividadHandler
  : crearFallback('deleteEstadoActividadHandler');

// Log de depuración para ver qué exporta el controlador
console.log(
  'estadosActividadController cargado en rutas:',
  Object.keys(estadosActividadController)
);

// 3. DEFINICIÓN DE RUTAS

// GET /estados-actividad → lista todos los estados
router.get('/', safeGetEstadosActividadHandler);

// GET /estados-actividad/:id → obtiene un estado por id
router.get('/:id', safeGetEstadoActividadByIdHandler);

// POST /estados-actividad → crea un nuevo estado
router.post('/', safeCreateEstadoActividadHandler);

// PUT /estados-actividad/:id → actualiza un estado
router.put('/:id', safeUpdateEstadoActividadHandler);

// DELETE /estados-actividad/:id → elimina un estado
router.delete('/:id', safeDeleteEstadoActividadHandler);

// 4. EXPORTACIONES
module.exports = router;
