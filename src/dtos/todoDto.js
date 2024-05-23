class TodoDto {
  constructor(id, title, description, isCompleted) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
  }
}

module.exports = TodoDto;
