const LabelController = require("../controllers/LabelController");

async function LabelRoutes(fastify, options) {
  fastify.get("/etiquetas", LabelController.getAllLabels);
}

module.exports = LabelRoutes;
