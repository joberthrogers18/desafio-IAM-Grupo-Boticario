const sequelizeInst = require("../config/configDatabase");

const Task = require("../models/TaskModel");
const Label = require("../models/LabelModel");
const User = require("../models/UserModel");

async function syncModels() {
  Task.associate({ Label, User });
  User.associate({ Task });
  Label.associate({ Task });

  await sequelizeInst.sync({ force: true });
  console.log("Base de dados criada com sucesso");
}

async function populateLabels() {
  const labels = [{ name: "Alta" }, { name: "Media" }, { name: "Baixa" }];

  for (const label of labels) {
    await Label.create(label);
  }

  console.log("Etiquetas populadas!");
}

module.exports = { syncModels, populateLabels, Task, Label };
