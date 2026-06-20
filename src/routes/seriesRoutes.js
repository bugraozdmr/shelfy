const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');
const upload = require('../middlewares/upload');

// Get all series (with advanced filtering)
router.get('/', seriesController.getAllSeries);

// Get seasons for a specific series
router.get('/:id/seasons', seriesController.getSeasonsBySeriesId);

router.post('/', upload.single('cover_image'), seriesController.createSeries);
router.put('/:id', upload.single('cover_image'), seriesController.updateSeries);

module.exports = router;
