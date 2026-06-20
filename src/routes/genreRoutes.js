const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');

// Get all genres
router.get('/', genreController.getAllGenres);

// Create a new genre explicitly
router.post('/', genreController.createGenre);

// Get a genre by ID
router.get('/:id', genreController.getGenreById);

// Update a genre by ID (e.g. rename)
router.put('/:id', genreController.updateGenre);

// Delete a genre by ID
router.delete('/:id', genreController.deleteGenre);

module.exports = router;
