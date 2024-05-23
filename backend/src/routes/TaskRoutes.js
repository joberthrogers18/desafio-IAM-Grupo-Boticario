const TaskController = require("../controllers/TaskController");

async function TaskRoutes(fastify, options) {
  fastify.get("/tarefa", TaskController.getAllTask);
  fastify.get("/tarefa/:id", TaskController.getTaskById);
  fastify.get("/tarefa/filtro", TaskController.getAllByCompletion);
  fastify.post("/tarefa", TaskController.postTaskObject);
  fastify.put("/tarefa", TaskController.putTaskObject);
  fastify.delete("/tarefa/:id", TaskController.deleteTaskObject);
}

module.exports = TaskRoutes;
