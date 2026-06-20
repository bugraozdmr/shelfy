const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middlewares/upload');

// Get all media entries (with advanced filtering)
router.get('/', mediaController.getAllMedia);

// Get a specific media entry by ID
router.get('/:id', mediaController.getMediaById);

// Delete a media entry by ID
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
