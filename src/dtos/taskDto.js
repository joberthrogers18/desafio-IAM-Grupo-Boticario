class TaskDto {
  constructor(id, title, description, isCompleted) {
    this.id = id;
    this.titulo = title;
    this.descricao = description;
    this.estaCompleto = isCompleted;
  }
}

module.exports = TaskDto;
