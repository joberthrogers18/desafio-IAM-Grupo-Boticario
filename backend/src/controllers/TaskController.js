const validator = require("validator");

const StatusCode = require("../constants/StatusCode");
const ResponseDTO = require("../dtos/ResponseDTO");
const ResponseErrorDTO = require("../dtos/ResponseErrorDTO");
const NotFoundException = require("../exceptions/NotFoundException");
const TaskService = require("../services/TaskService");

class TaskController {
  async getAllTask(request, reply) {
    try {
      const filters = {
        isCompleted:
          request.query && request.query.estaCompleta !== undefined
            ? validator.toBoolean(request.query.estaCompleta)
            : null,
        LabelId: request.query.idEtiqueta,
      };

      const tasks = await TaskService.getAllTasks(filters);
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
      const id = request.params && request.params.id ? request.params.id : null;

      if (!id || !validator.isHexadecimal(id)) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "O id fornecido é inválido",
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
              "Tarefa não encontrada. Forneça um número de id válido",
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

  async postTaskObject(request, reply) {
    try {
      const taskBody = request.body;

      if (
        !taskBody.titulo ||
        !taskBody.descricao ||
        !validator.isLength(taskBody.titulo, { min: 1 }) ||
        !validator.isLength(taskBody.descricao, { min: 1 }) ||
        !validator.isBoolean(taskBody.estaCompleto.toString())
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os campos 'titulo' e 'descricao' devem ter pelo menos 1 caractere e 'estaCompleto' deve ser um booleano",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      if (
        !taskBody.idEtiqueta &&
        !validator.isInt(String(taskBody.idEtiqueta))
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "A tarefa deve estar vinculada a uma etiqueta. o campo 'idEtiqueta' não pode ser nulo",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      const body = {
        title: taskBody.titulo,
        description: taskBody.descricao,
        isCompleted: validator.toBoolean(taskBody.estaCompleto.toString()),
        labelId: taskBody.idEtiqueta,
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
      console.log("error: aqui", error);

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
      const id = request.body && request.body.id ? request.body.id : null;
      const taskBody =
        request.body && request.body.tarefa ? request.body.tarefa : null;

      if (!id || !validator.isHexadecimal(id)) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "O campo 'id' é inválido",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      if (
        !validator.isLength(taskBody.titulo, { min: 1 }) ||
        !validator.isLength(taskBody.descricao, { min: 1 }) ||
        !validator.isBoolean(taskBody.estaCompleto.toString())
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os campos 'titulo' e 'descricao' devem ter pelo menos 1 caractere e 'estaCompleto' deve ser um booleano",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      if (
        !taskBody.idEtiqueta &&
        !validator.isInt(String(taskBody.idEtiqueta))
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "A tarefa deve estar vinculada a uma etiqueta. o campo 'idEtiqueta' não pode ser nulo",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      const body = {
        id,
        title: taskBody.titulo,
        description: taskBody.descricao,
        isCompleted: validator.toBoolean(taskBody.estaCompleto.toString()),
        labelId: taskBody.idEtiqueta,
      };

      const updatedTask = await TaskService.updateTask(id, body);
      return reply
        .status(StatusCode.SUCCESS)
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
              "Tarefa não encontrada. Forneça um número de id válido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível atualizar a tarefa. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }

  async deleteTaskObject(request, reply) {
    try {
      const id = request.params && request.params.id ? request.params.id : null;

      if (!id || !validator.isHexadecimal(id)) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "O id fornecido é inválido",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      await TaskService.deleteTask(id);
      return reply
        .status(StatusCode.SUCCESS)
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
              "Tarefa não encontrada. Forneça um número de id válido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível deletar a tarefa. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }
}

module.exports = new TaskController();
