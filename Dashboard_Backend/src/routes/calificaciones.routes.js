// src/routes/calificaciones.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso CALIFICACION.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;
let router;
let calificacionesController;

let safeGetCalificacionesHandler;
let safeGetCalificacionByIdHandler;
let safeCreateCalificacionHandler;
let safeUpdateCalificacionHandler;
let safeDeleteCalificacionHandler;


// 2. ASIGNACIONES
express = require('express');
router = express.Router();
calificacionesController = require('../controllers/calificaciones.controller');

// fallback
function crearFallback(nombre) {
  return function (req, res) {
    console.error('FALTA handler en calificaciones.controller:', nombre);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno: falta la función ' + nombre
    });
  };
}

safeGetCalificacionesHandler =
  typeof calificacionesController.getCalificacionesHandler === 'function'
    ? calificacionesController.getCalificacionesHandler
    : crearFallback('getCalificacionesHandler');

safeGetCalificacionByIdHandler =
  typeof calificacionesController.getCalificacionByIdHandler === 'function'
    ? calificacionesController.getCalificacionByIdHandler
    : crearFallback('getCalificacionByIdHandler');

safeCreateCalificacionHandler =
  typeof calificacionesController.createCalificacionHandler === 'function'
    ? calificacionesController.createCalificacionHandler
    : crearFallback('createCalificacionHandler');

safeUpdateCalificacionHandler =
  typeof calificacionesController.updateCalificacionHandler === 'function'
    ? calificacionesController.updateCalificacionHandler
    : crearFallback('updateCalificacionHandler');

safeDeleteCalificacionHandler =
  typeof calificacionesController.deleteCalificacionHandler === 'function'
    ? calificacionesController.deleteCalificacionHandler
    : crearFallback('deleteCalificacionHandler');

console.log(
  'calificacionesController cargado en rutas:',
  Object.keys(calificacionesController)
);


// 3. RUTAS

router.get('/', safeGetCalificacionesHandler);
router.get('/:id', safeGetCalificacionByIdHandler);
router.post('/', safeCreateCalificacionHandler);
router.put('/:id', safeUpdateCalificacionHandler);
router.delete('/:id', safeDeleteCalificacionHandler);


// 4. EXPORT
module.exports = router;
