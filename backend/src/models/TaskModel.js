const { DataTypes } = require("sequelize");
const sequelizeInst = require("../config/configDatabase");

const Task = sequelizeInst.define("Task", {
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
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  modifiedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
});

Task.associate = (models) => {
  Task.belongsTo(models.Label, {
    foreignKey: {
      allowNull: false,
    },
  });

  Task.belongsTo(models.User, {
    foreignKey: {
      allowNull: false,
    },
  });
};

module.exports = Task;
