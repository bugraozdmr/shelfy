const baseMediaService = require('../services/baseMediaService');
const movieService = require('../services/movieService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllMovies = async (req, res) => {
  req.query.type = 'MOVIE'; // Force filter to only movies
  const result = await baseMediaService.getAllMedia(req.query);
  return ApiResponse.success(res, result, 'Movies fetched successfully');
};

exports.createMovie = async (req, res) => {
  const movie = await movieService.createMovie(req.body, req.file);
  return ApiResponse.success(res, movie, 'Movie created successfully', 201);
};

exports.updateMovie = async (req, res) => {
  const movie = await movieService.updateMovie(req.params.id, req.body, req.file);
  return ApiResponse.success(res, movie, 'Movie updated successfully');
};
