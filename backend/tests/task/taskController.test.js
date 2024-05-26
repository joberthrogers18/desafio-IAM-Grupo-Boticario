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
    request = { body: {}, params: {}, query: {} };
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
      TaskService.getAllTasks.mockRejectedValue(
        new Error("Erro na base de dados")
      );

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

  describe("getTaskById", () => {
    it("should get task by id and return response with status 200", async () => {
      const mockTask = {
        id: hashIdMock,
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      };
      request.params.id = hashIdMock;
      TaskService.getTaskById.mockResolvedValue(mockTask);

      await TaskController.getTaskById(request, reply);

      expect(TaskService.getTaskById).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(mockTask, "").buildResponseObject()
      );
    });

    it("should return 400 if id was not inserted", async () => {
      await TaskController.getTaskById(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O id fornecido é inválido",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 404 if there is not task", async () => {
      request.params.id = hashIdMock;
      TaskService.getTaskById.mockRejectedValue(
        new NotFoundException("Tarefa não encontrada")
      );

      await TaskController.getTaskById(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Tarefa não encontrada. Forneça um número de id válido",
          StatusCode.NOT_FOUND
        ).buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      request.params.id = hashIdMock;
      TaskService.getTaskById.mockRejectedValue(
        new Error("Erro na base de dados")
      );

      await TaskController.getTaskById(request, reply);

      expect(reply.status).toHaveBeenCalledWith(
        StatusCode.INTERNAL_SERVER_ERROR
      );
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Não foi possível recuperar a tarefa atual. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });

  describe("getAllByCompletion", () => {
    it("should get task by completion and return response with status 200", async () => {
      const mockTasks = [
        {
          id: hashIdMock,
          titulo: "Titulo da tarefa",
          descricao: "Descrição da tarefa",
          estaCompleto: true,
        },
      ];
      request.params.id = hashIdMock;
      TaskService.getTaskByCompletion.mockResolvedValue(mockTasks);

      await TaskController.getAllByCompletion(request, reply);

      expect(TaskService.getTaskByCompletion).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(mockTasks, "").buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      request.query.estaCompleto = false;
      TaskService.getTaskByCompletion.mockRejectedValue(
        new Error("Erro na banco de dados")
      );

      await TaskController.getAllByCompletion(request, reply);

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

    it("should return bad request when task title is empty", async () => {
      const taskBody = {
        titulo: "",
        descricao: "Descrição da tarefa",
        estaCompleto: false,
      };
      request.body = taskBody;
      const mockTask = { id: 1, ...taskBody };
      TaskService.createTask.mockResolvedValue(mockTask);

      await TaskController.postTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'titulo' e 'descricao' devem ter pelo menos 1 caractere e 'estaCompleto' deve ser um booleano",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 400 if request body is invalid", async () => {
      request.body = { titulo: "Novo Titulo" };

      await TaskController.postTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'titulo' e 'descricao' devem ter pelo menos 1 caractere e 'estaCompleto' deve ser um booleano",
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
      const taskBody = {
        titulo: "Titulo da tarefa",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id: hashIdMock, tarefa: taskBody };
      const mockTask = { ...taskBody };
      TaskService.updateTask.mockResolvedValue(mockTask);

      await TaskController.putTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          mockTask,
          "Tarefa atualizada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return bad request when title is empty", async () => {
      const taskBody = {
        titulo: "",
        descricao: "Descrição da tarefa",
        estaCompleto: true,
      };
      request.body = { id: hashIdMock, tarefa: taskBody };
      const mockTask = { ...taskBody };
      TaskService.updateTask.mockResolvedValue(mockTask);

      await TaskController.putTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Os campos 'titulo' e 'descricao' devem ter pelo menos 1 caractere e 'estaCompleto' deve ser um booleano",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return 400 if request body is invalid", async () => {
      request.body = { tarefa: { titulo: "Tarefa atualizada" } };

      await TaskController.putTaskObject(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O campo 'id' é inválido",
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
          "Tarefa não encontrada. Forneça um número de id válido",
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
          "Não foi possível atualizar a tarefa. Por favor tente novamente mais tarde",
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
      expect(reply.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          null,
          "Tarefa deletada com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return bad request when id is null", async () => {
      request.params.id = null;

      await TaskController.deleteTaskObject(request, reply);

      expect(TaskService.deleteTask).toHaveBeenCalledWith(hashIdMock);
      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O id fornecido é inválido",
          StatusCode.BAD_REQUEST
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
          "Tarefa não encontrada. Forneça um número de id válido",
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
          "Não foi possível deletar a tarefa. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });
});
