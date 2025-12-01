// src/routes/cursos.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso CURSO_ACADEMICO.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;          // Paquete express
let router;           // Router para /cursos
let cursosController; // Controlador con la lógica de cursos

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
cursosController = require('../controllers/cursos.controller');

// (Opcional) Línea de depuración para asegurarnos de que llegan las funciones:
// console.log('cursosController en rutas:', cursosController);

// 3. DEFINICIÓN DE RUTAS

// GET /cursos → lista todos los cursos académicos
router.get('/', cursosController.getCursosHandler);

// GET /cursos/:id → obtiene un curso por id
router.get('/:id', cursosController.getCursoByIdHandler);

// POST /cursos → crea un nuevo curso académico
router.post('/', cursosController.createCursoHandler);

// PUT /cursos/:id → actualiza un curso académico
router.put('/:id', cursosController.updateCursoHandler);

// DELETE /cursos/:id → elimina un curso académico
router.delete('/:id', cursosController.deleteCursoHandler);

// 4. EXPORTACIONES
module.exports = router;

