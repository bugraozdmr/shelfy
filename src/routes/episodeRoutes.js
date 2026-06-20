const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');

// Create a new episode
router.post('/', episodeController.createEpisode);

// Update an episode by ID
router.put('/:id', episodeController.updateEpisode);

// Delete an episode by ID
router.delete('/:id', episodeController.deleteEpisode);

module.exports = router;
