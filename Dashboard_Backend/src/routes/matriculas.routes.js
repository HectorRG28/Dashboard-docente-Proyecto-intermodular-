// src/routes/matriculas.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso MATRICULA.
// Conecta las rutas HTTP con el controlador de matrículas
// y está "blindado" para no pasar handlers undefined.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;               // Paquete express
let router;                // Router específico para /matriculas
let matriculasController;  // Controlador con la lógica de matrículas

// Handlers seguros
let safeGetMatriculasHandler;
let safeGetMatriculaByIdHandler;
let safeCreateMatriculaHandler;
let safeUpdateMatriculaHandler;
let safeDeleteMatriculaHandler;


// 2. ASIGNACIONES
express = require('express');
router = express.Router();
matriculasController = require('../controllers/matriculas.controller');

// Fábrica de fallback: genera un handler válido si falta una función
function crearFallback(nombreFuncion) {
  return function (req, res) {
    console.error(
      'ERROR: El controlador de matrículas no define la función:',
      nombreFuncion
    );

    res.status(500).json({
      ok: false,
      mensaje:
        'Error de configuración interna: falta la función ' +
        nombreFuncion +
        ' en matriculas.controller.js'
    });
  };
}

// Asignación segura de cada handler
safeGetMatriculasHandler = (
  matriculasController &&
  typeof matriculasController.getMatriculasHandler === 'function'
)
  ? matriculasController.getMatriculasHandler
  : crearFallback('getMatriculasHandler');

safeGetMatriculaByIdHandler = (
  matriculasController &&
  typeof matriculasController.getMatriculaByIdHandler === 'function'
)
  ? matriculasController.getMatriculaByIdHandler
  : crearFallback('getMatriculaByIdHandler');

safeCreateMatriculaHandler = (
  matriculasController &&
  typeof matriculasController.createMatriculaHandler === 'function'
)
  ? matriculasController.createMatriculaHandler
  : crearFallback('createMatriculaHandler');

safeUpdateMatriculaHandler = (
  matriculasController &&
  typeof matriculasController.updateMatriculaHandler === 'function'
)
  ? matriculasController.updateMatriculaHandler
  : crearFallback('updateMatriculaHandler');

safeDeleteMatriculaHandler = (
  matriculasController &&
  typeof matriculasController.deleteMatriculaHandler === 'function'
)
  ? matriculasController.deleteMatriculaHandler
  : crearFallback('deleteMatriculaHandler');

// Log de depuración para ver qué exporta el controlador
console.log(
  'matriculasController cargado en rutas:',
  Object.keys(matriculasController)
);

// 3. DEFINICIÓN DE RUTAS

// GET /matriculas → lista todas las matrículas
router.get('/', safeGetMatriculasHandler);

// GET /matriculas/:id → obtiene una matrícula por id
router.get('/:id', safeGetMatriculaByIdHandler);

// POST /matriculas → crea una nueva matrícula
router.post('/', safeCreateMatriculaHandler);

// PUT /matriculas/:id → actualiza una matrícula
router.put('/:id', safeUpdateMatriculaHandler);

// DELETE /matriculas/:id → elimina una matrícula
router.delete('/:id', safeDeleteMatriculaHandler);

// 4. EXPORTACIONES
module.exports = router;
