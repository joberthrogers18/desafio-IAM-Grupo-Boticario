const TodoController = require("../../src/controllers/todoController");
const TodoService = require("../../src/services/todoService");
const StatusCode = require("../../src/constants/StatusCode");
const ResponseDTO = require("../../src/dtos/ResponseDTO");
const ResponseErrorDTO = require("../../src/dtos/ResponseErrorDTO");
const NotFoundException = require("../../src/exceptions/NotFoundException");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

jest.mock("../../src/services/todoService");

describe("Todo Controller", () => {
  let request;
  let reply;

  beforeEach(() => {
    request = { body: {}, params: {} };
    reply = {
      code: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllTodo", () => {
    it("should get all todos and return response with status 200", async () => {
      const mockTodos = [
        {
          id: hashIdMock,
          titulo: "Titulo da tarefa",
          descricao: "Descrição da tarefa",
          estaCompleto: false,
        },
      ];
      TodoService.getAllTodos.mockResolvedValue(mockTodos);

      const todoController = new TodoController();
      await todoController.getAllTodo(request, reply);

      expect(TodoService.getAllTodos).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(mockTodos, "").buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      TodoService.getAllTodos.mockRejectedValue(new Error("Database Error"));

      const todoController = new TodoController();
      await todoController.getAllTodo(request, reply);

      expect(reply.status).toHaveBeenCalledWith(
        StatusCode.INTERNAL_SERVER_ERROR
      );
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Não foi possível recuperar as tarefas listadas. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });

  describe("postTodoObject", () => {
    it("should create a new todo and return response with status 201", async () => {
      const todoBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      };
      request.body = todoBody;
      const mockTodo = { id: 1, ...todoBody };
      TodoService.createTodo.mockResolvedValue(mockTodo);

      const todoController = new TodoController();
      await todoController.postTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.CREATED);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          mockTodo,
          "Tarefa criada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return 400 if request body is invalid", async () => {
      request.body = { titulo: "Novo Titulo" };

      const todoController = new TodoController();
      await todoController.postTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'titulo', 'descricao' e 'estaCompleto' não podem ser nulos",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      const todoBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      };
      request.body = todoBody;
      TodoService.createTodo.mockRejectedValue(new Error("Database Error"));

      const todoController = new TodoController();
      await todoController.postTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(
        StatusCode.INTERNAL_SERVER_ERROR
      );
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Não foi possível criar a tarefa. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });

  describe("putTodoObject", () => {
    it("should update a todo and return response with status 201", async () => {
      const id = 1;
      const todoBody = {
        id,
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id, tarefa: todoBody };
      const mockTodo = { ...todoBody };
      TodoService.updateTodo.mockResolvedValue(mockTodo);

      const todoController = new TodoController();
      await todoController.putTodoObject(request, reply);

      expect(reply.code).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          mockTodo,
          "Tarefa atualizada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return 400 if request body is invalid", async () => {
      request.body = { tarefa: { titulo: "Tarefa atualizada" } };

      const todoController = new TodoController();
      await todoController.putTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'id' e 'tarefa' não podem ser nulos",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 404 if todo not found", async () => {
      const todoBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id: hashIdMock, tarefa: todoBody };
      TodoService.updateTodo.mockRejectedValue(
        new NotFoundException("Tarefa não encontrada")
      );

      const todoController = new TodoController();
      await todoController.putTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Tarefa não encontrada. Forneça um numero de id valido",
          StatusCode.NOT_FOUND
        ).buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      const todoBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id: hashIdMock, tarefa: todoBody };
      TodoService.updateTodo.mockRejectedValue(new Error("Database Error"));

      const todoController = new TodoController();
      await todoController.putTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(
        StatusCode.INTERNAL_SERVER_ERROR
      );
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Não foi possível criar a tarefa. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });

  describe("deleteTodoObject", () => {
    it("should delete a todo and return response with status 201", async () => {
      request.params.id = hashIdMock;

      const todoController = new TodoController();
      await todoController.deleteTodoObject(request, reply);

      expect(TodoService.deleteTodo).toHaveBeenCalledWith(hashIdMock);
      expect(reply.code).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(null, "Tarefa criada com sucesso").buildResponseObject()
      );
    });

    it("should return 404 if todo not found", async () => {
      request.params.id = hashIdMock;
      TodoService.deleteTodo.mockRejectedValue(
        new NotFoundException("Tarefa não encontrada")
      );

      const todoController = new TodoController();
      await todoController.deleteTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Tarefa não encontrado. Forneça um numero de id valido",
          StatusCode.NOT_FOUND
        ).buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      request.params.id = hashIdMock;
      TodoService.deleteTodo.mockRejectedValue(
        new Error("Erro no Banco de Dados")
      );

      const todoController = new TodoController();
      await todoController.deleteTodoObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(
        StatusCode.INTERNAL_SERVER_ERROR
      );
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Não foi possível criar a tarefa. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });
});
