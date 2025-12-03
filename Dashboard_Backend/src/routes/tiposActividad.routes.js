const { Router } = require('express');
const { getTipos } = require('../controllers/tiposActividad.controller.js');

const router = Router();

// Aquí es donde daba "undefined" si la importación fallaba
router.get('/', getTipos);

module.exports = router;