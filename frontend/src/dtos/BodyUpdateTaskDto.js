export class BodyUpdateTaskDto {
  constructor(id, title, description, isComplete, labelId) {
    this.id = id;
    this.tarefa = {
      titulo: title,
      descricao: description,
      estaCompleto: isComplete,
      idEtiqueta: labelId,
    };
  }
}
