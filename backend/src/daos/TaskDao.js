const Task = require("../models/TaskModel");
const Label = require("../models/LabelModel");
const NotFoundException = require("../exceptions/NotFoundException");

class TaskDao {
  async findAll(filters, idUser) {
    const where = {
      UserId: idUser,
    };

    if (filters.isCompleted !== null) {
      where.isCompleted = filters.isCompleted;
    }

    if (filters.LabelId) {
      where.LabelId = filters.LabelId;
    }

    return await Task.findAll({
      where,
      order: [["modifiedDate", "DESC"]],
      include: [
        {
          model: Label,
          attributes: ["name"],
        },
      ],
    });
  }

  async findById(id) {
    const taskData = await Task.findByPk(id, {
      include: [
        {
          model: Label,
          attributes: ["name"],
        },
      ],
    });

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
    const updatedTask = await taskData.update(task);
    return updatedTask;
  }

  async delete(id) {
    await Task.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = new TaskDao();
