const AuthController = require("../controllers/AuthController");

async function AuthRoutes(fastify, options) {
  fastify.post("/usuario/login", AuthController.login);
  fastify.post("/usuario", AuthController.register);
  fastify.put("/usuario", AuthController.updateUserData);
  fastify.delete("/usuario/:id", AuthController.deleteUser);
}

module.exports = AuthRoutes;
