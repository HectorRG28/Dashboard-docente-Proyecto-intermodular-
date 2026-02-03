const { Router } = require('express');
const multer = require('multer');
const { importFile, importWeb } = require('../controllers/import.controller.js');

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/file', upload.single('file'), importFile);
router.post('/web', importWeb);

module.exports = router;
