class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
  }
}

module.exports = NotFoundException;
