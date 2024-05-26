const TaskController = require("../controllers/TaskController");

async function TaskRoutes(fastify, options) {
  fastify.get("/tarefa", TaskController.getAllTask);
  fastify.post("/tarefa", TaskController.postTaskObject);
  fastify.put("/tarefa", TaskController.putTaskObject);
  fastify.delete("/tarefa/:id", TaskController.deleteTaskObject);
  fastify.get("/tarefa/:id", TaskController.getTaskById);
}

module.exports = TaskRoutes;
