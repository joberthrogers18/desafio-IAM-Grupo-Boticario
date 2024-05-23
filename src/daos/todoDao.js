const Todo = require("../models/todoModel");
const NotFoundException = require("../exceptions/NotFoundException");

class TodoDao {
  async findAll() {
    return await Todo.findAll();
  }

  async findById(id) {
    return Todo.findByPk(id);
  }

  async create(todo) {
    return Todo.create(todo);
  }

  async update(id, todo) {
    const todoData = await this.findById(id);

    if (!todoData) {
      throw new NotFoundException("Tarefa não encontrada!");
    }

    await todoData.update(todo);
    return todoData;
  }

  async delete(id, todo) {
    const todoData = await this.findById(id);

    if (!todoData) {
      throw new NotFoundException("Tarefa não encontrada!");
    }

    await todoData.destroy(todo);
    return todoData;
  }
}

module.exports = new TodoDao();
