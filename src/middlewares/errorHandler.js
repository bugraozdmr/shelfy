const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('Global Error:', err);

  let statusCode = 500;
  let message = 'A server error occurred';
  let errorDetail = err.message || 'Unknown error';

  // Customize error messages based on common Prisma errors or custom logic
  if (err.message && err.message.includes('not found')) {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.code === 'P2002') {
    // Prisma unique constraint failed
    statusCode = 400;
    message = 'This record already exists';
  } else if (err.code === 'P2025') {
    // Prisma record not found
    statusCode = 404;
    message = 'The record to be deleted or updated could not be found';
  }

  ApiResponse.error(res, errorDetail, message, statusCode);
};

module.exports = errorHandler;
