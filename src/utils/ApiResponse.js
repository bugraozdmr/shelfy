class ApiResponse {
  static success(res, data, message = 'İşlem başarılı', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, error, message = 'Bir hata oluştu', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error instanceof Error ? error.message : error
    });
  }
}

module.exports = ApiResponse;
