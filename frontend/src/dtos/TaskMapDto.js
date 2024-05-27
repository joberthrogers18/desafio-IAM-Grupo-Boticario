export class TaskMapDto {
  constructor(
    id,
    title,
    description,
    isComplete,
    dateCreation,
    dateModified,
    labelId,
    nameLabel
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isComplete = isComplete;
    this.dateCreation = dateCreation;
    this.dateModified = dateModified;
    this.labelId = labelId;
    this.nameLabel = nameLabel;
  }
}
