const { Router } = require('express');
// Importamos la nueva función deleteActividad
// Importamos la nueva función deleteActividad y updateActividad
const { getActividades, createActividad, deleteActividad, updateActividad, getAulasDisponibles } = require('../controllers/actividadesEvaluables.controller.js');

const router = Router();

router.get('/aulas-disponibles', getAulasDisponibles);
router.get('/', getActividades);
router.post('/', createActividad);

// NUEVA RUTA DELETE
router.delete('/:id', deleteActividad);

// NUEVA RUTA PUT
router.put('/:id', updateActividad);

module.exports = router;