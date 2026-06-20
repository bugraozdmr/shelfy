const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Global Error:', err);

  let statusCode = 500;
  let message = 'Sunucu tarafında bir hata oluştu';
  let errorDetail = err.message || 'Unknown error';

  // Customize error messages based on common Prisma errors or custom logic
  if (err.message && err.message.includes('not found')) {
    statusCode = 404;
    message = 'Kayıt bulunamadı';
  } else if (err.code === 'P2002') {
    // Prisma unique constraint failed
    statusCode = 400;
    message = 'Bu kayıt zaten mevcut';
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'Silinmek veya güncellenmek istenen kayıt bulunamadı';
  }

  ApiResponse.error(res, errorDetail, message, statusCode);
};

module.exports = errorHandler;
