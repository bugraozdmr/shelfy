const genreService = require('../services/genreService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllGenres = async (req, res) => {
  const genres = await genreService.getAllGenres();
  return ApiResponse.success(res, genres, 'Genres fetched successfully');
};

exports.createGenre = async (req, res) => {
  const genre = await genreService.createGenre(req.body);
  return ApiResponse.success(res, genre, 'Genre created successfully', 201);
};

exports.getGenreById = async (req, res) => {
  const genre = await genreService.getGenreById(req.params.id);
  return ApiResponse.success(res, genre, 'Genre fetched successfully');
};

exports.updateGenre = async (req, res) => {
  const genre = await genreService.updateGenre(req.params.id, req.body);
  return ApiResponse.success(res, genre, 'Genre updated successfully');
};

exports.deleteGenre = async (req, res) => {
  await genreService.deleteGenre(req.params.id);
  return ApiResponse.success(res, null, 'Genre deleted successfully');
};
