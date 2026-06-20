const baseMediaService = require('../services/baseMediaService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllMedia = async (req, res) => {
  const result = await baseMediaService.getAllMedia(req.query);
  return ApiResponse.success(res, result, 'Media fetched successfully');
};

exports.getMediaById = async (req, res) => {
  const media = await baseMediaService.getMediaById(req.params.id);
  return ApiResponse.success(res, media, 'Media fetched successfully');
};

exports.deleteMedia = async (req, res) => {
  await baseMediaService.deleteMedia(req.params.id);
  return ApiResponse.success(res, null, 'Media deleted successfully');
};
