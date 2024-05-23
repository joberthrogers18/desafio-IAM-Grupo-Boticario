// TODO: centralize config with environment variable

const Sequelize = require("sequelize");

const sequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: "todo.db",
});

module.exports = sequelizeInstance;
