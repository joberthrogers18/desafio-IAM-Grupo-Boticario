const sequelizeInst = require("../config/configDatabase");
// const { DataTypes } = require("sequelize");

const Task = require("../models/TaskModel");
const Label = require("../models/LabelModel");

Task.associate({ Label });
Label.associate({ Task });

async function syncModels() {
  await sequelizeInst.sync({ force: true });
  console.log("Database & tables created!");
}

async function populateLabels() {
  const labels = [{ name: "Alta" }, { name: "Media" }, { name: "Baixa" }];

  for (const label of labels) {
    await Label.create(label);
  }

  console.log("Labels populated!");
}

module.exports = { syncModels, populateLabels, Task, Label };
