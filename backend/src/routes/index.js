const LabelRoutes = require("./LabelRoutes");
const TaskRoutes = require("./TaskRoutes");

function applyRoutes(app) {
  app.register(TaskRoutes);
  app.register(LabelRoutes);
  app.get("/", async (request, reply) => {
    return { message: "Tudo funcionando corretamente." };
  });
}

module.exports = applyRoutes;
