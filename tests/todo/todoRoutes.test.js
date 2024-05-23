const fastify = require("fastify");
const TodoRoutes = require("../../src/routes/TodoRoutes"); // Ajuste o caminho conforme necessário
const TodoController = require("../../src/controllers/TodoController");
const statusCodes = require("../../src/constants/StatusCode");

jest.mock("../../src/controllers/TodoController");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

describe("TodoRoutes", () => {
  let app;

  beforeAll(() => {
    app = fastify();
    app.register(TodoRoutes);
  });

  afterAll(() => {
    app.close();
  });

  test("GET /tarefa should call TodoController.getAllTodo", async () => {
    TodoController.getAllTodo.mockResolvedValue({}); // Simula a resposta do controlador

    const response = await app.inject({
      method: "GET",
      url: "/tarefa",
    });

    expect(TodoController.getAllTodo).toHaveBeenCalled();
    expect(response.statusCode).toBe(statusCodes.SUCCESS);
  });

  test("POST /tarefa should call TodoController.postTodoObject", async () => {
    TodoController.postTodoObject.mockResolvedValue({});

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

    expect(TodoController.postTodoObject).toHaveBeenCalled();
    expect(response.statusCode).toBe(statusCodes.SUCCESS);
  });

  test("PUT /tarefa should call TodoController.putTodoObject", async () => {
    TodoController.putTodoObject.mockResolvedValue({});

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

    expect(TodoController.putTodoObject).toHaveBeenCalled();
    expect(response.statusCode).toBe(statusCodes.SUCCESS);
  });

  test("DELETE /tarefa/:id should call TodoController.deleteTodoObject", async () => {
    TodoController.deleteTodoObject.mockResolvedValue({});

    const response = await app.inject({
      method: "DELETE",
      url: `/tarefa/${hashIdMock}`,
    });

    expect(response.statusCode).toBe(200);
    expect(TodoController.deleteTodoObject).toHaveBeenCalled();
  });
});
