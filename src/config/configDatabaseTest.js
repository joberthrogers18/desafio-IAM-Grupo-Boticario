const Sequelize = require("sequelize");

const sequelizeInstance = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

module.exports = sequelizeInstance;
