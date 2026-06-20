const baseMediaService = require('../services/baseMediaService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllMedia = async (req, res) => {
  const result = await baseMediaService.getAllMedia(req.query);
  return ApiResponse.success(res, result, 'Medyalar başarıyla getirildi');
};

exports.getMediaById = async (req, res) => {
  const media = await baseMediaService.getMediaById(req.params.id);
  return ApiResponse.success(res, media, 'Medya başarıyla getirildi');
};

exports.deleteMedia = async (req, res) => {
  await baseMediaService.deleteMedia(req.params.id);
  return ApiResponse.success(res, null, 'Medya başarıyla silindi');
};
