const express = require('express');
const router = express.Router();
const printMediaController = require('../controllers/printMediaController');
const upload = require('../middlewares/upload');

// Get all print media (with advanced filtering)
router.get('/', printMediaController.getAllPrintMedia);

router.post('/', upload.single('cover_image'), printMediaController.createPrintMedia);
router.put('/:id', upload.single('cover_image'), printMediaController.updatePrintMedia);

module.exports = router;
