const Todo = require("./src/models/todoModel");
const TodoRoutes = require("./src/routes/TodoRoutes");
const fastify = require("fastify")({ logger: true });

// TODO: let the port dynamic for using with environment variable

const start = async () => {
  try {
    Todo.sync();

    fastify.register(TodoRoutes);

    fastify.get("/", async (request, reply) => {
      return { message: "Tudo funcionando corretamente." };
    });

    await fastify.listen({
      port: 3000,
    });
    fastify.log.info(
      `Server is running in port: ${fastify.server.address().port}`
    );
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
