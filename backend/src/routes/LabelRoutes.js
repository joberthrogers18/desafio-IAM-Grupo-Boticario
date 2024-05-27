const LabelController = require("../controllers/LabelController");
const authMiddleware = require("../middlewares/auth");

async function LabelRoutes(fastify, options) {
  fastify.get(
    "/etiquetas",
    { preHandler: [authMiddleware] },
    LabelController.getAllLabels
  );
}

module.exports = LabelRoutes;
