const TaskController = require("../../src/controllers/taskController");
const TaskService = require("../../src/services/TaskService");
const StatusCode = require("../../src/constants/StatusCode");
const ResponseDTO = require("../../src/dtos/ResponseDTO");
const ResponseErrorDTO = require("../../src/dtos/ResponseErrorDTO");
const NotFoundException = require("../../src/exceptions/NotFoundException");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

jest.mock("../../src/services/TaskService");

describe("Task Controller", () => {
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

  describe("getAllTask", () => {
    it("should get all tasks and return response with status 200", async () => {
      const mockTasks = [
        {
          id: hashIdMock,
          titulo: "Titulo da tarefa",
          descricao: "Descrição da tarefa",
          estaCompleto: false,
        },
      ];
      TaskService.getAllTasks.mockResolvedValue(mockTasks);

      await TaskController.getAllTask(request, reply);

      expect(TaskService.getAllTasks).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(mockTasks, "").buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      TaskService.getAllTasks.mockRejectedValue(new Error("Database Error"));

      await TaskController.getAllTask(request, reply);

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

  describe("postTaskObject", () => {
    it("should create a new task and return response with status 201", async () => {
      const taskBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      };
      request.body = taskBody;
      const mockTask = { id: 1, ...taskBody };
      TaskService.createTask.mockResolvedValue(mockTask);

      await TaskController.postTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.CREATED);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          mockTask,
          "Tarefa criada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return 400 if request body is invalid", async () => {
      request.body = { titulo: "Novo Titulo" };

      await TaskController.postTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'titulo', 'descricao' e 'estaCompleto' não podem ser nulos",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      const taskBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      };
      request.body = taskBody;
      TaskService.createTask.mockRejectedValue(new Error("Database Error"));

      await TaskController.postTaskObject(request, reply);

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

  describe("putTaskObject", () => {
    it("should update a task and return response with status 201", async () => {
      const id = 1;
      const taskBody = {
        id,
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id, tarefa: taskBody };
      const mockTask = { ...taskBody };
      TaskService.updateTask.mockResolvedValue(mockTask);

      await TaskController.putTaskObject(request, reply);

      expect(reply.code).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          mockTask,
          "Tarefa atualizada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return 400 if request body is invalid", async () => {
      request.body = { tarefa: { titulo: "Tarefa atualizada" } };

      await TaskController.putTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'id' e 'tarefa' não podem ser nulos",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 404 if task not found", async () => {
      const taskBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id: hashIdMock, tarefa: taskBody };
      TaskService.updateTask.mockRejectedValue(
        new NotFoundException("Tarefa não encontrada")
      );

      await TaskController.putTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Tarefa não encontrada. Forneça um numero de id valido",
          StatusCode.NOT_FOUND
        ).buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      const taskBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id: hashIdMock, tarefa: taskBody };
      TaskService.updateTask.mockRejectedValue(new Error("Database Error"));

      await TaskController.putTaskObject(request, reply);

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

  describe("deleteTaskObject", () => {
    it("should delete a task and return response with status 201", async () => {
      request.params.id = hashIdMock;

      await TaskController.deleteTaskObject(request, reply);

      expect(TaskService.deleteTask).toHaveBeenCalledWith(hashIdMock);
      expect(reply.code).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          null,
          "Tarefa deletada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return 404 if task not found", async () => {
      request.params.id = hashIdMock;
      TaskService.deleteTask.mockRejectedValue(
        new NotFoundException("Tarefa não encontrada")
      );

      await TaskController.deleteTaskObject(request, reply);

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
      TaskService.deleteTask.mockRejectedValue(
        new Error("Erro no Banco de Dados")
      );

      await TaskController.deleteTaskObject(request, reply);

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