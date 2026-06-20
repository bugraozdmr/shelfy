const episodeService = require('../services/episodeService');
const ApiResponse = require('../utils/ApiResponse');

exports.createEpisode = async (req, res) => {
  const episode = await episodeService.createEpisode(req.body);
  return ApiResponse.success(res, episode, 'Episode created successfully', 201);
};

exports.updateEpisode = async (req, res) => {
  const episode = await episodeService.updateEpisode(req.params.id, req.body);
  return ApiResponse.success(res, episode, 'Episode updated successfully');
};

exports.deleteEpisode = async (req, res) => {
  await episodeService.deleteEpisode(req.params.id);
  return ApiResponse.success(res, null, 'Episode deleted successfully');
};
