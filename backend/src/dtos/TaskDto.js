class TaskDto {
  constructor(
    id,
    title,
    description,
    isCompleted,
    creationDate,
    modifiedDate,
    labelId,
    labelName
  ) {
    this.id = id;
    this.titulo = title;
    this.descricao = description;
    this.estaCompleto = isCompleted;
    this.dataCriacao = creationDate;
    this.dataModificacao = modifiedDate;
    this.etiqueta = {
      id: labelId,
      nome: labelName,
    };
  }
}

module.exports = TaskDto;
