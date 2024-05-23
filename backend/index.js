const Task = require("./src/models/TaskModel");
const applyRoutes = require("./src/routes");
const fastify = require("fastify")({ logger: true });

// TODO: let the port dynamic for using with environment variable

const start = async () => {
  try {
    const PORT = process.env.PORT_SERVER || 3000;

    Task.sync();

    applyRoutes(fastify);

    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
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
