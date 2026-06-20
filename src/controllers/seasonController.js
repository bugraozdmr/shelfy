const seasonService = require('../services/seasonService');
const episodeService = require('../services/episodeService');
const ApiResponse = require('../utils/ApiResponse');

exports.getEpisodesBySeasonId = async (req, res) => {
  const episodes = await episodeService.getEpisodesBySeasonId(req.params.id);
  return ApiResponse.success(res, episodes, 'Season episodes fetched successfully');
};

exports.createSeason = async (req, res) => {
  const season = await seasonService.createSeason(req.body, req.file);
  return ApiResponse.success(res, season, 'Season created successfully', 201);
};

exports.updateSeason = async (req, res) => {
  const season = await seasonService.updateSeason(req.params.id, req.body, req.file);
  return ApiResponse.success(res, season, 'Season updated successfully');
};

exports.deleteSeason = async (req, res) => {
  await seasonService.deleteSeason(req.params.id);
  return ApiResponse.success(res, null, 'Season deleted successfully');
};
