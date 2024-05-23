const TodoRoutes = require("./TodoRoutes");

function applyRoutes(app) {
  app.register(TodoRoutes);
  app.get("/", async (request, reply) => {
    return { message: "Tudo funcionando corretamente." };
  });
}

module.exports = applyRoutes;
