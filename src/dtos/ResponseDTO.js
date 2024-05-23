class ResponseDTO {
  constructor(data, message) {
    this.data = data;
  }

  buildResponseObject() {
    return {
      data: this.data,
      message: this.message,
    };
  }
}

module.exports = ResponseDTO;
