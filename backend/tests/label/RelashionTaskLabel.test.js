const { Task, Label, populateLabels } = require("../../src/models");
const sequelizeInst = require("../../src/config/configDatabaseTest");
const { generateHash } = require("../../src/utils/encryption");

beforeAll(async () => {
  await sequelizeInst.sync({ force: true });
});

afterAll(async () => {
  const modelNames = Object.keys(sequelizeInst.models);
  for (const name of modelNames) {
    await sequelizeInst.models[name].destroy({ where: {}, force: true });
  }
  await sequelizeInst.close();
});

describe("Task and Label Models", () => {
  test("should create a task with a label", async () => {
    const label = await Label.create({ name: "Alta" });
    const task = await Task.create({
      id: generateHash(),
      title: "TItulo da Tarefa",
      description: "Descrição da Tarefa",
      isCompleted: false,
      creationDate: new Date("05-05-2024"),
      modifiedDate: new Date("05-05-2024"),
      LabelId: label.id,
    });

    const fetchedTask = await Task.findOne({
      where: { id: task.id },
      include: { model: Label },
    });

    expect(fetchedTask.Label).toBeTruthy();
    expect(fetchedTask.Label.name).toBe("Alta");
  });

  test("should populate data in Label table", async () => {
    await populateLabels();
    const labels = await Label.findAll();
    expect(labels.length).toBeGreaterThan(0);
  });
});
