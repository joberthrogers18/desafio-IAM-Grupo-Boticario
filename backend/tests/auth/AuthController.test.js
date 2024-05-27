// AuthController.test.js
const AuthController = require("../../src/controllers/AuthController");
const AuthService = require("../../src/services/AuthService");
const User = require("../../src/models/UserModel");
const { generateToken } = require("../../src/utils/auth");
const { hashPassword, verifyPassword } = require("../../src/utils/encryption");
const StatusCode = require("../../src/constants/StatusCode");
const ResponseDTO = require("../../src/dtos/ResponseDTO");
const ResponseErrorDTO = require("../../src/dtos/ResponseErrorDTO");
const validator = require("validator");

jest.mock("../../src/services/AuthService");
jest.mock("../../src/models/UserModel");
jest.mock("../../src/utils/auth");
jest.mock("../../src/utils/encryption");
jest.mock("validator");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

describe("AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return BAD_REQUEST if any required field is missing or invalid", async () => {
      const req = { body: { usuario: "", email: "invalido", senha: "" } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await AuthController.register(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O 'email', 'usuario' e 'senha' não podem ser nulos",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should create a new user and return CREATED status", async () => {
      const req = {
        body: {
          usuario: "teste",
          email: "teste@gmail.com",
          senha: "teste",
        },
      };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const hashedPassword = "";
      const user = { id: hashIdMock };

      validator.isEmail.mockReturnValue(true);
      hashPassword.mockResolvedValue(hashedPassword);
      AuthService.createUser.mockResolvedValue(user);

      await AuthController.register(req, reply);

      expect(hashPassword).toHaveBeenCalledWith("teste");
      expect(AuthService.createUser).toHaveBeenCalledWith({
        email: "teste@gmail.com",
        username: "teste",
        password: hashedPassword,
      });
      expect(reply.status).toHaveBeenCalledWith(StatusCode.CREATED);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          { userId: user.id },
          "Usuário cadastrado com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return 400 status if username already exists", async () => {
      const req = {
        body: {
          usuario: "teste",
          email: "teste@gmail.com",
          senha: "teste",
        },
      };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const hashedPassword = "teste_hash";

      validator.isEmail.mockReturnValue(true);
      hashPassword.mockResolvedValue(hashedPassword);
      AuthService.createUser.mockRejectedValue(new Error("Usuário já existe"));

      await AuthController.register(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
    });
  });

  describe("login", () => {
    it("should return BAD_REQUEST if email or password is missing or invalid", async () => {
      const req = { body: { email: "invalido", senha: "" } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await AuthController.login(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O 'email', 'usuario' e 'senha' não podem ser nulos",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return CREATED status with a token if login is successful", async () => {
      const req = { body: { email: "teste@gmail.com", senha: "teste" } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const user = { email: "teste@gmail.com", password: "teste_hash" };
      const token = hashIdMock;

      validator.isEmail.mockReturnValue(true);
      validator.trim.mockImplementation((str) => str);
      User.findOne.mockResolvedValue(user);
      verifyPassword.mockResolvedValue(true);
      generateToken.mockReturnValue(token);

      await AuthController.login(req, reply);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: "teste@gmail.com" },
      });
      expect(verifyPassword).toHaveBeenCalledWith("teste", "teste_hash");
      expect(generateToken).toHaveBeenCalledWith(user);
      expect(reply.status).toHaveBeenCalledWith(StatusCode.CREATED);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          { token },
          "Usuário logado com sucesso"
        ).buildResponseObject()
      );
    });

    it("should return BAD_REQUEST if login fails", async () => {
      const req = {
        body: { email: "teste@gmail.com", senha: "testezada" },
      };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const user = { email: "teste@gmail.com", password: "teste_hash" };

      validator.isEmail.mockReturnValue(true);
      validator.trim.mockImplementation((str) => str);
      User.findOne.mockResolvedValue(user);
      verifyPassword.mockResolvedValue(false);

      await AuthController.login(req, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Email ou senha não são compatíveis. Tente novamente",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });
  });

  describe("updateUserData", () => {
    it("should return BAD_REQUEST if id is missing or invalid", async () => {
      const request = { body: {} };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await AuthController.updateUserData(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O campo 'id' é inválido",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should return BAD_REQUEST if user profile data is missing or invalid", async () => {
      const request = { body: { id: hashIdMock } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await AuthController.updateUserData(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O campo 'id' é inválido",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should update user data and return SUCCESS status", async () => {
      const id = hashIdMock;
      const request = {
        body: {
          id,
          perfil: {
            usuario: "teste2",
            email: "teste2@example.com",
            senha: "testeteste",
          },
        },
      };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const hashedPassword = "hashed_password";
      const updatedUser = { id };

      validator.isHexadecimal.mockReturnValue(true);
      validator.isLength.mockReturnValue(true);
      hashPassword.mockResolvedValue(hashedPassword);
      AuthService.updateUsers.mockResolvedValue(updatedUser);

      await AuthController.updateUserData(request, reply);

      expect(hashPassword).toHaveBeenCalledWith("testeteste");
      expect(AuthService.updateUsers).toHaveBeenCalledWith(id, {
        id,
        username: "teste2",
        email: "teste2@example.com",
        password: hashedPassword,
      });
      expect(reply.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          updatedUser,
          "Dados de usuário atualizado com sucesso"
        ).buildResponseObject()
      );
    });
  });

  describe("deleteUser", () => {
    it("should return BAD_REQUEST if id is missing or invalid", async () => {
      const request = { params: {} };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await AuthController.deleteUser(request, reply);

      expect(reply.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "O id fornecido é inválido",
          StatusCode.BAD_REQUEST
        ).buildResponseObject()
      );
    });

    it("should delete user and return SUCCESS status", async () => {
      const id = hashIdMock;
      const request = { params: { id } };
      const reply = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      AuthService.deleteUser.mockResolvedValue();

      await AuthController.deleteUser(request, reply);

      expect(AuthService.deleteUser).toHaveBeenCalledWith(id);
      expect(reply.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(
          null,
          "Usuário deletado com sucesso"
        ).buildResponseObject()
      );
    });
  });
});
