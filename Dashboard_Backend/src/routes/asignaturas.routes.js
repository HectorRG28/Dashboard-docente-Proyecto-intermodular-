const express = require('express');
const router = express.Router();
const controller = require('../controllers/asignaturas.controller');

// GET /api/asignaturas
router.get('/', controller.getAll);

module.exports = router;