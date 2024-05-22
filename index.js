const fastify = require("fastify")({ logger: true });

const start = async () => {
  try {
    await fastify.listen({
      port: 3000,
    });
    fastify.log.info(
      `Server is running in port: ${fastify.server.address().port}`
    );
  } catch (error) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
