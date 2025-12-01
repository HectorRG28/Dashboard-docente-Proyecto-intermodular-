// src/routes/actividadesEvaluables.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso ACTIVIDAD_EVALUABLE.
// Conecta las rutas HTTP con el controlador de actividades
// evaluables y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;                          // Paquete express
let router;                           // Router específico para /actividades-evaluables
let actividadesEvaluablesController;  // Controlador con la lógica de actividades

// Handlers seguros
let safeGetActividadesEvaluablesHandler;
let safeGetActividadEvaluableByIdHandler;
let safeCreateActividadEvaluableHandler;
let safeUpdateActividadEvaluableHandler;
let safeDeleteActividadEvaluableHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
actividadesEvaluablesController = require('../controllers/actividadesEvaluables.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de actividades evaluables no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en actividadesEvaluables.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetActividadesEvaluablesHandler = (
  actividadesEvaluablesController &&
  typeof actividadesEvaluablesController.getActividadesEvaluablesHandler === 'function'
)
  ? actividadesEvaluablesController.getActividadesEvaluablesHandler
  : crearFallback('getActividadesEvaluablesHandler');

safeGetActividadEvaluableByIdHandler = (
  actividadesEvaluablesController &&
  typeof actividadesEvaluablesController.getActividadEvaluableByIdHandler === 'function'
)
  ? actividadesEvaluablesController.getActividadEvaluableByIdHandler
  : crearFallback('getActividadEvaluableByIdHandler');

safeCreateActividadEvaluableHandler = (
  actividadesEvaluablesController &&
  typeof actividadesEvaluablesController.createActividadEvaluableHandler === 'function'
)
  ? actividadesEvaluablesController.createActividadEvaluableHandler
  : crearFallback('createActividadEvaluableHandler');

safeUpdateActividadEvaluableHandler = (
  actividadesEvaluablesController &&
  typeof actividadesEvaluablesController.updateActividadEvaluableHandler === 'function'
)
  ? actividadesEvaluablesController.updateActividadEvaluableHandler
  : crearFallback('updateActividadEvaluableHandler');

safeDeleteActividadEvaluableHandler = (
  actividadesEvaluablesController &&
  typeof actividadesEvaluablesController.deleteActividadEvaluableHandler === 'function'
)
  ? actividadesEvaluablesController.deleteActividadEvaluableHandler
  : crearFallback('deleteActividadEvaluableHandler');

// Log de depuración para ver qué exporta el controlador
console.log(
  'actividadesEvaluablesController cargado en rutas:',
  Object.keys(actividadesEvaluablesController)
);

// 3. DEFINICIÓN DE RUTAS

// GET /actividades-evaluables → lista todas las actividades
router.get('/', safeGetActividadesEvaluablesHandler);

// GET /actividades-evaluables/:id → obtiene una actividad por id
router.get('/:id', safeGetActividadEvaluableByIdHandler);

// POST /actividades-evaluables → crea una nueva actividad
router.post('/', safeCreateActividadEvaluableHandler);

// PUT /actividades-evaluables/:id → actualiza una actividad
router.put('/:id', safeUpdateActividadEvaluableHandler);

// DELETE /actividades-evaluables/:id → elimina una actividad
router.delete('/:id', safeDeleteActividadEvaluableHandler);

// 4. EXPORTACIONES
module.exports = router;
