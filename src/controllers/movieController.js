const baseMediaService = require('../services/baseMediaService');
const movieService = require('../services/movieService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllMovies = async (req, res) => {
  req.query.type = 'MOVIE'; // Force filter to only movies
  const result = await baseMediaService.getAllMedia(req.query);
  return ApiResponse.success(res, result, 'Filmler başarıyla getirildi');
};

exports.createMovie = async (req, res) => {
  const movie = await movieService.createMovie(req.body, req.file);
  return ApiResponse.success(res, movie, 'Film başarıyla oluşturuldu', 201);
};

exports.updateMovie = async (req, res) => {
  const movie = await movieService.updateMovie(req.params.id, req.body, req.file);
  return ApiResponse.success(res, movie, 'Film başarıyla güncellendi');
};
