const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../middlewares/upload');

// Get all movies (with advanced filtering)
router.get('/', movieController.getAllMovies);

router.post('/', upload.single('cover_image'), movieController.createMovie);
router.put('/:id', upload.single('cover_image'), movieController.updateMovie);

module.exports = router;
