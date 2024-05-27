const {
  Task,
  Label,
  User,
  populateLabels,
  syncModels,
} = require("../../src/models");
const sequelizeInst = require("../../src/config/configDatabaseTest");
const { generateHash } = require("../../src/utils/encryption");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

beforeAll(async () => {
  await sequelizeInst.sync({ force: true });
  syncModels(sequelizeInst);
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
    const generatedHash = generateHash();
    const user = await User.create({
      id: generateHash(),
      email: `${generatedHash}@gmail.com`,
      username: generatedHash,
      password: "teste",
    });

    console.log("Aquii ===============", label.id, user.id);

    console.log({
      id: generateHash(),
      title: "TItulo da Tarefa",
      description: "Descrição da Tarefa",
      isCompleted: false,
      creationDate: new Date(),
      modifiedDate: new Date(),
      LabelId: label.id,
      UserId: user.id,
    });

    const task = await Task.create({
      id: generateHash(),
      title: "TItulo da Tarefa",
      description: "Descrição da Tarefa",
      isCompleted: false,
      creationDate: new Date(),
      modifiedDate: new Date(),
      LabelId: label.id,
      UserId: user.id,
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
