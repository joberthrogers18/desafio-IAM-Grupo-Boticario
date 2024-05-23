const StatusCode = require("../constants/StatusCode");
const ResponseDTO = require("../dtos/ResponseDTO");
const ResponseErrorDTO = require("../dtos/ResponseErrorDTO");
const NotFoundException = require("../exceptions/NotFoundException");
const TaskService = require("../services/TaskService");

class TaskController {
  async getAllTask(request, reply) {
    try {
      const tasks = await TaskService.getAllTasks();
      return reply
        .status(StatusCode.SUCCESS)
        .send(new ResponseDTO(tasks, "").buildResponseObject());
    } catch (error) {
      console.log("error: ", error);

      return reply
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(
          new ResponseErrorDTO(
            "Não foi possível recuperar as tarefas listadas. Por favor tente novamente mais tarde",
            StatusCode.INTERNAL_SERVER_ERROR
          ).buildResponseObject()
        );
    }
  }

  async getTaskById(request, reply) {
    try {
      const id =
        request.params && request.params.hasOwnProperty("id")
          ? request.params.id
          : null;

      if (!id) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os id não podem ser nulos",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      const task = await TaskService.getTaskById(id);
      return reply
        .status(StatusCode.SUCCESS)
        .send(new ResponseDTO(task, "").buildResponseObject());
    } catch (error) {
      console.log("error: ", error);

      if (error instanceof NotFoundException) {
        return reply
          .status(StatusCode.NOT_FOUND)
          .send(
            new ResponseErrorDTO(
              "Tarefa não encontrada. Forneça um numero de id valido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível recuperar a tarefa atual. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }

  async getAllByCompletion(request, reply) {
    try {
      const isComplete =
        request.query && request.query.hasOwnProperty("estaCompleto")
          ? request.params.id
          : true;

      const tasks = await TaskService.getTaskByCompletion(isComplete);
      return reply
        .status(StatusCode.SUCCESS)
        .send(new ResponseDTO(tasks, "").buildResponseObject());
    } catch (error) {
      console.log("error: ", error);

      return reply
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(
          new ResponseErrorDTO(
            "Não foi possível recuperar as tarefas listadas. Por favor tente novamente mais tarde",
            StatusCode.INTERNAL_SERVER_ERROR
          ).buildResponseObject()
        );
    }
  }

  async postTaskObject(request, reply) {
    try {
      const taskBody = request.body;

      if (
        !taskBody ||
        !taskBody.hasOwnProperty("titulo") ||
        !taskBody.hasOwnProperty("descricao") ||
        !taskBody.hasOwnProperty("estaCompleto")
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os campos 'titulo', 'descricao' e 'estaCompleto' não podem ser nulos",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      const body = {
        title: taskBody.titulo,
        description: taskBody.descricao,
        isCompleted: taskBody.estaCompleto,
      };

      const createdTask = await TaskService.createTask(body);
      return reply
        .status(StatusCode.CREATED)
        .send(
          new ResponseDTO(
            createdTask,
            "Tarefa criada com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log("error: ", error);

      return reply
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(
          new ResponseErrorDTO(
            "Não foi possível criar a tarefa. Por favor tente novamente mais tarde",
            StatusCode.INTERNAL_SERVER_ERROR
          ).buildResponseObject()
        );
    }
  }

  async putTaskObject(request, reply) {
    try {
      const id =
        request.body && request.body.hasOwnProperty("id")
          ? request.body.id
          : null;

      const taskBody =
        request.body && request.body.hasOwnProperty("tarefa")
          ? request.body.tarefa
          : null;

      if (!id || !taskBody) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os campos 'id' e 'tarefa' não podem ser nulos",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      if (
        !taskBody ||
        !taskBody.hasOwnProperty("titulo") ||
        !taskBody.hasOwnProperty("descricao") ||
        !taskBody.hasOwnProperty("estaCompleto")
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os campos 'titulo', 'descricao' e 'estaCompleto' dentro do objeto tarefa não podem ser nulos",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      const body = {
        id,
        title: taskBody.titulo,
        description: taskBody.descricao,
        isCompleted: taskBody.estaCompleto,
      };

      const updatedTask = await TaskService.updateTask(id, body);
      return reply
        .code(StatusCode.SUCCESS)
        .send(
          new ResponseDTO(
            updatedTask,
            "Tarefa atualizada com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log("error: ", error);

      if (error instanceof NotFoundException) {
        return reply
          .status(StatusCode.NOT_FOUND)
          .send(
            new ResponseErrorDTO(
              "Tarefa não encontrada. Forneça um numero de id valido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível criar a tarefa. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }

  async deleteTaskObject(request, reply) {
    try {
      const id =
        request.params && request.params.hasOwnProperty("id")
          ? request.params.id
          : null;

      await TaskService.deleteTask(id);
      return reply
        .code(StatusCode.SUCCESS)
        .send(
          new ResponseDTO(
            null,
            "Tarefa deletada com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log("error: ", error);

      if (error instanceof NotFoundException) {
        return reply
          .status(StatusCode.NOT_FOUND)
          .send(
            new ResponseErrorDTO(
              "Tarefa não encontrado. Forneça um numero de id valido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível criar a tarefa. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }
}

module.exports = new TaskController();
