const TaskController = require("../controllers/TaskController");
const authMiddleware = require("../middlewares/auth");

async function TaskRoutes(fastify, options) {
  fastify.get(
    "/tarefa",
    { preHandler: [authMiddleware] },
    TaskController.getAllTask
  );
  fastify.post(
    "/tarefa",
    { preHandler: [authMiddleware] },
    TaskController.postTaskObject
  );
  fastify.put(
    "/tarefa",
    { preHandler: [authMiddleware] },
    TaskController.putTaskObject
  );
  fastify.delete(
    "/tarefa/:id",
    { preHandler: [authMiddleware] },
    TaskController.deleteTaskObject
  );
  fastify.get(
    "/tarefa/:id",
    { preHandler: [authMiddleware] },
    TaskController.getTaskById
  );
}

module.exports = TaskRoutes;
