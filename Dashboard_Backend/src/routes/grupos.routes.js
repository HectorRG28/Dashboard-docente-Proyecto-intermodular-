// src/routes/grupos.routes.js
// ----------------------------------------------------------
// Router de Express para el recurso GRUPO.
// Conecta las rutas HTTP con el controlador de grupos.
// ----------------------------------------------------------

// 1. DECLARACIONES
let express;          // Paquete express
let router;           // Router específico para /grupos
let gruposController; // Controlador con la lógica de grupos

// 2. ASIGNACIONES
express = require('express');
router = express.Router();
gruposController = require('../controllers/grupos.controller');

// 3. DEFINICIÓN DE RUTAS

// GET /grupos → lista todos los grupos
router.get('/', gruposController.getGruposHandler);

// GET /grupos/:id → obtiene un grupo por id
router.get('/:id', gruposController.getGrupoByIdHandler);

// POST /grupos → crea un nuevo grupo
router.post('/', gruposController.createGrupoHandler);

// PUT /grupos/:id → actualiza un grupo
router.put('/:id', gruposController.updateGrupoHandler);

// DELETE /grupos/:id → elimina un grupo
router.delete('/:id', gruposController.deleteGrupoHandler);

// 4. EXPORTACIONES
// Exportamos directamente el router (corrección que ya aplicamos siempre).
module.exports = router;
