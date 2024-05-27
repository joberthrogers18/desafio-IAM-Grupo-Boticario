const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/auth");

async function AuthRoutes(fastify, options) {
  fastify.post("/usuario/login", AuthController.login);
  fastify.post("/usuario", AuthController.register);
  fastify.put(
    "/usuario",
    { preHandler: [authMiddleware] },
    AuthController.updateUserData
  );
  fastify.delete(
    "/usuario/:id",
    { preHandler: [authMiddleware] },
    AuthController.deleteUser
  );
}

module.exports = AuthRoutes;
