// src/routes/periodos.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso PERIODO_EVALUACION.
// Conecta las rutas HTTP con el controlador de periodos,
// y está "blindado" para que nunca se pase un handler undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;              // Paquete express
let router;               // Router específico para /periodos
let periodosController;   // Controlador con la lógica de periodos

// Handlers seguros (si el controlador no los define, se usa un fallback)
let safeGetPeriodosHandler;
let safeGetPeriodoByIdHandler;
let safeCreatePeriodoHandler;
let safeUpdatePeriodoHandler;
let safeDeletePeriodoHandler;

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
periodosController = require('../controllers/periodos.controller');

// 2.1. Fallback genérico por si alguna función del controlador no existe
function crearFallback(nombreFuncion) {
  // Esta función devuelve SIEMPRE un handler válido (function(req,res){...})
  return function (req, res) {
    console.error(
      'ERROR: El controlador de periodos no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en periodos.controller.js'
    });
  };
}

// 2.2. Asignamos cada handler de forma segura
safeGetPeriodosHandler = (
  periodosController &&
  typeof periodosController.getPeriodosHandler === 'function'
)
  ? periodosController.getPeriodosHandler
  : crearFallback('getPeriodosHandler');

safeGetPeriodoByIdHandler = (
  periodosController &&
  typeof periodosController.getPeriodoByIdHandler === 'function'
)
  ? periodosController.getPeriodoByIdHandler
  : crearFallback('getPeriodoByIdHandler');

safeCreatePeriodoHandler = (
  periodosController &&
  typeof periodosController.createPeriodoHandler === 'function'
)
  ? periodosController.createPeriodoHandler
  : crearFallback('createPeriodoHandler');

safeUpdatePeriodoHandler = (
  periodosController &&
  typeof periodosController.updatePeriodoHandler === 'function'
)
  ? periodosController.updatePeriodoHandler
  : crearFallback('updatePeriodoHandler');

safeDeletePeriodoHandler = (
  periodosController &&
  typeof periodosController.deletePeriodoHandler === 'function'
)
  ? periodosController.deletePeriodoHandler
  : crearFallback('deletePeriodoHandler');

// 2.3. (Opcional) Log de depuración para que veas qué se está cargando
console.log('periodosController cargado en rutas:', Object.keys(periodosController));

// 3. DEFINICIÓN DE RUTAS

// GET /periodos → lista todos los periodos
router.get('/', safeGetPeriodosHandler);

// GET /periodos/:id → obtiene un periodo por id
router.get('/:id', safeGetPeriodoByIdHandler);

// POST /periodos → crea un nuevo periodo
router.post('/', safeCreatePeriodoHandler);

// PUT /periodos/:id → actualiza un periodo
router.put('/:id', safeUpdatePeriodoHandler);

// DELETE /periodos/:id → elimina un periodo
router.delete('/:id', safeDeletePeriodoHandler);

// 4. EXPORTACIONES
module.exports = router;

