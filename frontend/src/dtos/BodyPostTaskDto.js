export class BodyPostTaskDto {
  constructor(title, description, isComplete) {
    this.titulo = title;
    this.descricao = description;
    this.estaCompleto = isComplete;
  }
}
