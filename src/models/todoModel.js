const { DataTypes } = require("sequelize");
const sequelizeInst = require("../config/configDatabase");
const { generateHash } = require("../utils/encryption");

const Todo = sequelizeInst.define("Todo", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Todo;
