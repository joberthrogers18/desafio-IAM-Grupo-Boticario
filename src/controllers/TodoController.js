const StatusCode = require("../constants/StatusCode");
const ResponseDTO = require("../dtos/ResponseDTO");
const ResponseErrorDTO = require("../dtos/ResponseErrorDTO");
const NotFoundException = require("../exceptions/NotFoundException");
const TodoService = require("../services/TodoService");

class TodoController {
  async getAllTodo(request, reply) {
    try {
      const todos = await TodoService.getAllTodos();
      return reply
        .status(StatusCode.SUCCESS)
        .send(new ResponseDTO(todos, "").buildResponseObject());
    } catch (error) {
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

  async postTodoObject(request, reply) {
    try {
      const todoBody = request.body;

      if (
        !todoBody ||
        !todoBody.hasOwnProperty("titulo") ||
        !todoBody.hasOwnProperty("descricao") ||
        !todoBody.hasOwnProperty("estaCompleto")
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
        title: todoBody.titulo,
        description: todoBody.descricao,
        isCompleted: todoBody.estaCompleto,
      };

      const createdTodo = await TodoService.createTodo(body);
      return reply
        .status(StatusCode.CREATED)
        .send(
          new ResponseDTO(
            createdTodo,
            "Tarefa criada com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log(error);
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

  async putTodoObject(request, reply) {
    try {
      const id =
        request.body && request.body.hasOwnProperty("id")
          ? request.body.id
          : null;

      const todoBody =
        request.body && request.body.hasOwnProperty("tarefa")
          ? request.body.tarefa
          : null;

      if (!id || !todoBody) {
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
        !todoBody ||
        !todoBody.hasOwnProperty("titulo") ||
        !todoBody.hasOwnProperty("descricao") ||
        !todoBody.hasOwnProperty("estaCompleto")
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
        title: todoBody.titulo,
        description: todoBody.descricao,
        isCompleted: todoBody.estaCompleto,
      };

      const updatedTodo = await TodoService.updateTodo(id, body);
      return reply
        .code(StatusCode.SUCCESS)
        .send(
          new ResponseDTO(
            updatedTodo,
            "Tarefa atualizada com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
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

  async deleteTodoObject(request, reply) {
    try {
      const id =
        request.params && request.params.hasOwnProperty("id")
          ? request.params.id
          : null;

      await TodoService.deleteTodo(id);
      return reply
        .code(StatusCode.SUCCESS)
        .send(
          new ResponseDTO(
            null,
            "Tarefa deletada com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
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

module.exports = new TodoController();
