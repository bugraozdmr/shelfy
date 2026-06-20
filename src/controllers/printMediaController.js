const baseMediaService = require('../services/baseMediaService');
const printMediaService = require('../services/printMediaService');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllPrintMedia = async (req, res) => {
  req.query.type = 'PRINT'; // Force filter to only print media
  const result = await baseMediaService.getAllMedia(req.query);
  return ApiResponse.success(res, result, 'Kitap/Mangalar başarıyla getirildi');
};

exports.createPrintMedia = async (req, res) => {
  const printMedia = await printMediaService.createPrintMedia(req.body, req.file);
  return ApiResponse.success(res, printMedia, 'Kitap/Manga başarıyla oluşturuldu', 201);
};

exports.updatePrintMedia = async (req, res) => {
  const printMedia = await printMediaService.updatePrintMedia(req.params.id, req.body, req.file);
  return ApiResponse.success(res, printMedia, 'Kitap/Manga başarıyla güncellendi');
};
