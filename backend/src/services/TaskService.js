const TaskDao = require("../daos/TaskDao");
const TaskDto = require("../dtos/TaskDto");
const { adjustToBrazilTimezone } = require("../utils/dataHourManipulation");
const { generateHash } = require("../utils/encryption");

class TaskService {
  async getAllTasks() {
    const tasks = await TaskDao.findAll();
    return tasks.map(
      (task) =>
        new TaskDto(
          task.id,
          task.title,
          task.description,
          task.isCompleted,
          task.creationDate,
          task.modifiedDate,
          task.LabelId,
          task.Label.name
        )
    );
  }

  async getTaskById(id) {
    const task = await TaskDao.findById(id);
    return new TaskDto(
      task.id,
      task.title,
      task.description,
      task.isCompleted,
      task.creationDate,
      task.modifiedDate,
      task.LabelId,
      task.Label.name
    );
  }

  async getTaskByCompletion(isCompleted) {
    const tasks = await TaskDao.findByKey("isCompleted", isCompleted);
    return tasks.map(
      (task) =>
        new TaskDto(
          task.id,
          task.title,
          task.description,
          task.isCompleted,
          task.creationDate,
          task.modifiedDate,
          task.LabelId,
          task.Label.name
        )
    );
  }

  async createTask(taskObj) {
    const hashId = generateHash();
    const currentDate = new Date();
    taskObj.id = hashId;
    taskObj.LabelId = taskObj.labelId;
    taskObj.creationDate = adjustToBrazilTimezone(currentDate);
    taskObj.modifiedDate = adjustToBrazilTimezone(currentDate);
    const task = await TaskDao.create(taskObj);
    return new TaskDto(
      task.id,
      task.title,
      task.description,
      task.isCompleted,
      task.creationDate,
      task.modifiedDate
    );
  }

  async updateTask(id, taskObj) {
    const currentDate = new Date();
    taskObj.modifiedDate = adjustToBrazilTimezone(currentDate);
    taskObj.LabelId = taskObj.labelId;
    const task = await TaskDao.update(id, taskObj);
    return new TaskDto(
      task.id,
      task.title,
      task.description,
      task.isCompleted,
      task.creationDate,
      task.modifiedDate,
      task.LabelId
    );
  }

  async deleteTask(id) {
    await TaskDao.delete(id);
  }
}

module.exports = new TaskService();
