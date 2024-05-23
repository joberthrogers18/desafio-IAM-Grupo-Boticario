class ResponseDTO {
  constructor(data, message) {
    this.data = data;
    this.message = message;
  }

  buildResponseObject() {
    return {
      data: this.data,
      message: this.message,
    };
  }
}

module.exports = ResponseDTO;
