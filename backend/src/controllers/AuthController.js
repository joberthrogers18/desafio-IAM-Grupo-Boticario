const validator = require("validator");

const StatusCode = require("../constants/StatusCode");
const ResponseDTO = require("../dtos/ResponseDTO");
const ResponseErrorDTO = require("../dtos/ResponseErrorDTO");
const NotFoundException = require("../exceptions/NotFoundException");
const User = require("../models/UserModel");
const AuthService = require("../services/AuthService");
const { generateToken } = require("../utils/auth");
const { hashPassword, verifyPassword } = require("../utils/encryption");

class AuthController {
  async register(req, reply) {
    const { usuario, email, senha } = req.body;

    if (!usuario || !email || !senha || !validator.isEmail(email)) {
      return reply
        .status(StatusCode.BAD_REQUEST)
        .send(
          new ResponseErrorDTO(
            "O 'email', 'usuario' e 'senha' não podem ser nulos",
            StatusCode.BAD_REQUEST
          ).buildResponseObject()
        );
    }

    const hashedPassword = await hashPassword(senha);

    try {
      const body = {
        email,
        username: usuario,
        password: hashedPassword,
      };

      const user = await AuthService.createUser(body);

      return reply
        .status(StatusCode.CREATED)
        .send(
          new ResponseDTO(
            { userId: user.id },
            "Usuário cadastrado com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log(error);
      return reply.status(400).send({ error: "Username already exists" });
    }
  }

  async login(req, reply) {
    const { email, senha } = req.body;

    if (!email || !senha || !validator.isEmail(email)) {
      return reply
        .status(StatusCode.BAD_REQUEST)
        .send(
          new ResponseErrorDTO(
            "O 'email', 'usuario' e 'senha' não podem ser nulos",
            StatusCode.BAD_REQUEST
          ).buildResponseObject()
        );
    }

    const user = await User.findOne({
      where: { email: validator.trim(email) },
    });

    try {
      if (
        user &&
        (await verifyPassword(validator.trim(senha), user.password))
      ) {
        const token = generateToken(user);
        return reply
          .status(StatusCode.CREATED)
          .send(
            new ResponseDTO(
              { token },
              "Usuário logado com sucesso"
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Email ou senha não são compatíveis. Tente novamente",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }
    } catch (error) {
      console.log(error);
      return reply
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(
          new ResponseErrorDTO(
            "Erro ao logar. Tente novamente mais tarde.",
            StatusCode.INTERNAL_SERVER_ERROR
          ).buildResponseObject()
        );
    }
  }

  async updateUserData(request, reply) {
    try {
      const id = request.body && request.body.id ? request.body.id : null;
      const userBody =
        request.body && request.body.perfil ? request.body.perfil : null;

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
        !userBody ||
        !userBody.email ||
        !userBody.usuario ||
        !userBody.senha ||
        !validator.isLength(userBody.email, { min: 1 }) ||
        !validator.isLength(userBody.usuario, { min: 1 }) ||
        !validator.isLength(userBody.senha, { min: 1 })
      ) {
        return reply
          .status(StatusCode.BAD_REQUEST)
          .send(
            new ResponseErrorDTO(
              "Os campos 'usuario' e 'email' e 'senha' devem ter pelo menos 1 caractere",
              StatusCode.BAD_REQUEST
            ).buildResponseObject()
          );
      }

      const hashedPassword = await hashPassword(userBody.senha);

      const body = {
        id,
        username: userBody.usuario,
        email: userBody.email,
        password: hashedPassword,
      };

      const updatedTask = await AuthService.updateUsers(id, body);

      return reply
        .status(StatusCode.SUCCESS)
        .send(
          new ResponseDTO(
            updatedTask,
            "Dados de usuário atualizado com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log("error: ", error);

      if (error instanceof NotFoundException) {
        return reply
          .status(StatusCode.NOT_FOUND)
          .send(
            new ResponseErrorDTO(
              "Usuário não encontrada. Forneça um número de id válido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível atualizar os dados de usuário. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }

  async deleteUser(request, reply) {
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

      await AuthService.deleteUser(id);
      return reply
        .status(StatusCode.SUCCESS)
        .send(
          new ResponseDTO(
            null,
            "Usuário deletado com sucesso"
          ).buildResponseObject()
        );
    } catch (error) {
      console.log("error: ", error);

      if (error instanceof NotFoundException) {
        return reply
          .status(StatusCode.NOT_FOUND)
          .send(
            new ResponseErrorDTO(
              "Usuário não encontrada. Forneça um número de id válido",
              StatusCode.NOT_FOUND
            ).buildResponseObject()
          );
      } else {
        return reply
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .send(
            new ResponseErrorDTO(
              "Não foi possível deletar a usuário. Por favor tente novamente mais tarde",
              StatusCode.INTERNAL_SERVER_ERROR
            ).buildResponseObject()
          );
      }
    }
  }
}

module.exports = new AuthController();
