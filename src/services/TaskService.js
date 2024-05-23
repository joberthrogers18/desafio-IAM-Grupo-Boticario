const TaskDao = require("../daos/TaskDao");
const TaskDto = require("../dtos/TaskDto");
const { generateHash } = require("../utils/encryption");

class TaskService {
  async getAllTasks() {
    const tasks = await TaskDao.findAll();
    return tasks.map(
      (task) =>
        new TaskDto(task.id, task.title, task.description, task.isCompleted)
    );
  }

  // async getTaskById()

  async createTask(TaskDto) {
    const hashId = generateHash();
    TaskDto.id = hashId;
    const task = await TaskDao.create(TaskDto);
    return new TaskDto(task.id, task.title, task.description, task.isCompleted);
  }

  async updateTask(id, TaskDto) {
    const task = await TaskDao.update(id, TaskDto);
    return new TaskDto(task.id, task.title, task.description, task.isCompleted);
  }

  async deleteTask(id) {
    await TaskDao.delete(id);
  }
}

module.exports = new TaskService();
