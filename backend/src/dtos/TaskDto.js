class TaskDto {
  constructor(id, title, description, isCompleted, creationDate, modifiedDate) {
    this.id = id;
    this.titulo = title;
    this.descricao = description;
    this.estaCompleto = isCompleted;
    this.dataCriacao = creationDate;
    this.dataModificacao = modifiedDate;
  }
}

module.exports = TaskDto;
