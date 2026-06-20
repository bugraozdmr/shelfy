class ApiResponse {
  static success(res, data, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, error, message = 'An error occurred', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : error
    });
  }
}

module.exports = ApiResponse;
