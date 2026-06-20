const baseMediaService = require('../services/baseMediaService');
const seriesService = require('../services/seriesService');
const seasonService = require('../services/seasonService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllSeries = async (req, res) => {
  req.query.type = 'SERIES'; // Force filter to only series
  const result = await baseMediaService.getAllMedia(req.query);
  return ApiResponse.success(res, result, 'Diziler başarıyla getirildi');
};

exports.getSeasonsBySeriesId = async (req, res) => {
  const seasons = await seasonService.getSeasonsBySeriesId(req.params.id);
  return ApiResponse.success(res, seasons, 'Diziye ait sezonlar başarıyla getirildi');
};

exports.createSeries = async (req, res) => {
  const series = await seriesService.createSeries(req.body, req.file);
  return ApiResponse.success(res, series, 'Dizi başarıyla oluşturuldu', 201);
};

exports.updateSeries = async (req, res) => {
  const series = await seriesService.updateSeries(req.params.id, req.body, req.file);
  return ApiResponse.success(res, series, 'Dizi başarıyla güncellendi');
};
