export class BodyUpdateTaskDto {
  constructor(id, title, description, isComplete) {
    this.id = id;
    this.tarefa = {
      titulo: title,
      descricao: description,
      estaCompleto: isComplete,
    };
  }
}
