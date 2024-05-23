const TodoController = require("../controllers/TodoController");

async function TodoRoutes(fastify, options) {
  fastify.get("/tarefa", TodoController.getAllTodo);
  fastify.post("/tarefa", TodoController.postTodoObject);
  fastify.put("/tarefa", TodoController.putTodoObject);
  fastify.delete("/tarefa/:id", TodoController.deleteTodoObject);
}

module.exports = TodoRoutes;
