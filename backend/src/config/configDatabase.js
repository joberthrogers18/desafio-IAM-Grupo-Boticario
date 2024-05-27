const Sequelize = require("sequelize");

const sequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: "task.db",
});

module.exports = sequelizeInstance;
