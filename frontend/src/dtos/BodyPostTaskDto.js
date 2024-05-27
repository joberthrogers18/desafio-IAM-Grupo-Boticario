export class BodyPostTaskDto {
  constructor(title, description, isComplete, idLabel) {
    this.titulo = title;
    this.descricao = description;
    this.estaCompleto = isComplete;
    this.idEtiqueta = idLabel;
  }
}
