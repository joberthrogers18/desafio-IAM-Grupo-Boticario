const Task = require("../models/TaskModel");
const NotFoundException = require("../exceptions/NotFoundException");

class TaskDao {
  async findAll() {
    return await Task.findAll();
  }

  async findById(id) {
    return Task.findByPk(id);
  }

  async create(task) {
    return Task.create(task);
  }

  async update(id, task) {
    const taskData = await this.findById(id);

    if (!taskData) {
      throw new NotFoundException("Tarefa não encontrada!");
    }

    await taskData.update(task);
    return taskData;
  }

  async delete(id, task) {
    const taskData = await this.findById(id);

    if (!taskData) {
      throw new NotFoundException("Tarefa não encontrada!");
    }

    await taskData.destroy(task);
    return taskData;
  }
}

module.exports = new TaskDao();
