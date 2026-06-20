const ApiResponse = require('../utils/ApiResponse');

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return ApiResponse.error(res, 'Missing APP_API_KEY header (x-api-key)', 'Yetkisiz erişim', 401);
  }

  if (apiKey !== process.env.APP_API_KEY) {
    return ApiResponse.error(res, 'Invalid API Key', 'Yetkisiz erişim', 401);
  }

  next();
};

module.exports = authMiddleware;
