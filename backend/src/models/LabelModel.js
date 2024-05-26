const { DataTypes } = require("sequelize");
const sequelizeInst = require("../config/configDatabase");

const Label = sequelizeInst.define("Label", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Label.associate = (models) => {
  Label.hasMany(models.Task);
};

module.exports = Label;
