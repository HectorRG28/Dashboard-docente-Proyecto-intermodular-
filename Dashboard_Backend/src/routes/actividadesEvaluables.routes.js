const { Router } = require('express');
// Importamos la nueva función deleteActividad
const { getActividades, createActividad, deleteActividad } = require('../controllers/actividadesEvaluables.controller.js');

const router = Router();

router.get('/', getActividades);
router.post('/', createActividad);

// NUEVA RUTA DELETE
router.delete('/:id', deleteActividad);

module.exports = router;