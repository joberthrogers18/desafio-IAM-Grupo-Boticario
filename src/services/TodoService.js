const todoDao = require("../daos/todoDao");
const TodoDto = require("../dtos/todoDto");
const { generateHash } = require("../utils/encryption");

class TodoService {
  async getAllTodos() {
    const todos = await todoDao.findAll();
    return todos.map(
      (todo) =>
        new TodoDto(todo.id, todo.title, todo.description, todo.isCompleted)
    );
  }

  async createTodo(todoDto) {
    const hashId = generateHash();
    todoDto.id = hashId;
    const todo = await todoDao.create(todoDto);
    return new TodoDto(todo.id, todo.title, todo.description, todo.isCompleted);
  }

  async updateTodo(id, todoDto) {
    const todo = await todoDao.update(id, todoDto);
    return new TodoDto(todo.id, todo.title, todo.description, todo.isCompleted);
  }

  async deleteTodo(id) {
    await todoDao.delete(id);
  }
}

module.exports = new TodoService();
