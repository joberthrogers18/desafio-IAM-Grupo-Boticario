const fastify = require("fastify");
const TaskRoutes = require("../../src/routes/TaskRoutes");
const TaskController = require("../../src/controllers/TaskController");
const statusCodes = require("../../src/constants/StatusCode");

jest.mock("../../src/controllers/TaskController");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

describe("TaskRoutes", () => {
  let app;

  beforeAll(() => {
    app = fastify();
    app.register(TaskRoutes);
  });

  afterAll(() => {
    app.close();
  });

  test("GET /tarefa should call TaskController.getAllTask", async () => {
    TaskController.getAllTask.mockResolvedValue({}); // Simula a resposta do controlador

    const response = await app.inject({
      method: "GET",
      url: "/tarefa",
    });

    expect(TaskController.getAllTask).toHaveBeenCalled();
    expect(response.statusCode).toBe(statusCodes.SUCCESS);
  });

  test("POST /tarefa should call TaskController.postTaskObject", async () => {
    TaskController.postTaskObject.mockResolvedValue({});

    const response = await app.inject({
      method: "POST",
      url: "/tarefa",
      body: {
        id: hashIdMock,
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      },
    });

    expect(TaskController.postTaskObject).toHaveBeenCalled();
    expect(response.statusCode).toBe(statusCodes.SUCCESS);
  });

  test("PUT /tarefa should call TaskController.putTaskObject", async () => {
    TaskController.putTaskObject.mockResolvedValue({});

    const response = await app.inject({
      method: "PUT",
      url: "/tarefa",
      body: {
        id: hashIdMock,
        tarefa: {
          titulo: "Titulo da tarefa",
          descricao: "Descrição da tarefa",
          estaCompleto: false,
        },
      },
    });

    expect(TaskController.putTaskObject).toHaveBeenCalled();
    expect(response.statusCode).toBe(statusCodes.SUCCESS);
  });

  test("DELETE /tarefa/:id should call TaskController.deleteTaskObject", async () => {
    TaskController.deleteTaskObject.mockResolvedValue({});

    const response = await app.inject({
      method: "DELETE",
      url: `/tarefa/${hashIdMock}`,
    });

    expect(response.statusCode).toBe(200);
    expect(TaskController.deleteTaskObject).toHaveBeenCalled();
  });
});
