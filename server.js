const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mediaRoutes = require('./src/routes/mediaRoutes');
const movieRoutes = require('./src/routes/movieRoutes');
const seriesRoutes = require('./src/routes/seriesRoutes');
const printMediaRoutes = require('./src/routes/printMediaRoutes');
const genreRoutes = require('./src/routes/genreRoutes');
const seasonRoutes = require('./src/routes/seasonRoutes');
const episodeRoutes = require('./src/routes/episodeRoutes');
const authMiddleware = require('./src/middlewares/authMiddleware');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 1453;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply API Key Protection globally to all /api routes
app.use('/api', authMiddleware);

// Routes
app.use('/api/media', mediaRoutes); // Generic GETs and base Delete
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/print', printMediaRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/episodes', episodeRoutes);

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Hello man!',
    });
});

// 404 Catch-All Middleware for undefined routes
const ApiResponse = require('./src/utils/ApiResponse');
app.use((req, res, next) => {
    return ApiResponse.error(res, `Route ${req.method} ${req.originalUrl} not found`, 'Uç nokta bulunamadı', 404);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});