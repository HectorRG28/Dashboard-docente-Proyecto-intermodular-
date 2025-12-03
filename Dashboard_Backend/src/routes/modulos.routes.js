const { Router } = require('express');
const { getModulos } = require('../controllers/modulos.controller.js');

const router = Router();

router.get('/', getModulos);

module.exports = router;