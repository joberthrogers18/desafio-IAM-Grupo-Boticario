const todoDao = require("../daos/todoDao");
const TodoDto = require("../dtos/todoDto");

class TodoService {
  async getAllTodos() {
    const todos = await todoDao.findAll();
    return todos.map(
      (todo) =>
        new TodoDto(todo.id, todo.title, todo.description, todo.completed)
    );
  }

  async createTodo(todoDto) {
    const todo = await todoDao.create(todoDto);
    return new TodoDto(todo.id, todo.title, todo.description, todo.completed);
  }

  async updateTodo(id, todoDto) {
    const todo = await todoDao.update(id, todoDto);
    return new TodoDto(todo.id, todo.title, todo.description, todo.completed);
  }

  async deleteTodo(id) {
    await todoDao.delete(id);
  }
}

module.exports = new TodoService();
