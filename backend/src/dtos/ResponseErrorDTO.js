class ResponseErrorDTO {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }

  buildResponseObject() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

module.exports = ResponseErrorDTO;
