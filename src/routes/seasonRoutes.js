const express = require('express');
const router = express.Router();
const seasonController = require('../controllers/seasonController');
const upload = require('../middlewares/upload');

// Get episodes for a specific season
router.get('/:id/episodes', seasonController.getEpisodesBySeasonId);

// Create a new season with image upload
router.post('/', upload.single('cover_image'), seasonController.createSeason);

// Update a season by ID (can also update the image)
router.put('/:id', upload.single('cover_image'), seasonController.updateSeason);

// Delete a season by ID
router.delete('/:id', seasonController.deleteSeason);

module.exports = router;
