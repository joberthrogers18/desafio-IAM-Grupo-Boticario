const { DataTypes } = require("sequelize");
const sequelizeInst = require("../config/configDatabase");

const User = sequelizeInst.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamp: true,
  }
);

User.associate = (models) => {
  User.hasMany(models.Task);
};

module.exports = User;
