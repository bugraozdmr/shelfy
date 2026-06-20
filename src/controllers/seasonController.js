const seasonService = require('../services/seasonService');
const episodeService = require('../services/episodeService');
const ApiResponse = require('../utils/ApiResponse');

exports.getEpisodesBySeasonId = async (req, res) => {
  const episodes = await episodeService.getEpisodesBySeasonId(req.params.id);
  return ApiResponse.success(res, episodes, 'Sezona ait bölümler başarıyla getirildi');
};

exports.createSeason = async (req, res) => {
  const season = await seasonService.createSeason(req.body, req.file);
  return ApiResponse.success(res, season, 'Sezon başarıyla oluşturuldu', 201);
};

exports.updateSeason = async (req, res) => {
  const season = await seasonService.updateSeason(req.params.id, req.body, req.file);
  return ApiResponse.success(res, season, 'Sezon başarıyla güncellendi');
};

exports.deleteSeason = async (req, res) => {
  await seasonService.deleteSeason(req.params.id);
  return ApiResponse.success(res, null, 'Sezon başarıyla silindi');
};
