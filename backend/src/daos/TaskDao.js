const Task = require("../models/TaskModel");
const NotFoundException = require("../exceptions/NotFoundException");

class TaskDao {
  async findAll() {
    return await Task.findAll({
      order: [["modifiedDate", "DESC"]],
    });
  }

  async findByKey(key, value) {
    return await Task.findAll({
      where: {
        [key]: value,
      },
      order: [["modifiedDate", "DESC"]],
    });
  }

  async findById(id) {
    const taskData = await Task.findByPk(id);

    if (!taskData) {
      throw new NotFoundException("Tarefa não encontrada!");
    }

    return taskData;
  }

  async create(task) {
    return Task.create(task);
  }

  async update(id, task) {
    const taskData = await this.findById(id);
    await taskData.update(task);
    return taskData;
  }

  async delete(id, task) {
    const taskData = await this.findById(id);
    await taskData.destroy(task);
    return taskData;
  }
}

module.exports = new TaskDao();
