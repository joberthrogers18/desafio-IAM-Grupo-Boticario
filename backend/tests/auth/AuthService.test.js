// authService.test.js
const AuthService = require("../../src/services/AuthService");
const AuthDao = require("../../src/daos/AuthDao");
const { generateHash } = require("../../src/utils/encryption");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

jest.mock("../../src/daos/AuthDao");
jest.mock("../../src/utils/encryption");

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user and return the user ID", async () => {
      const mockUser = {
        username: "teste",
        email: "teste@gmail.com",
        password: "teste",
      };
      const createdUser = { id: hashIdMock };

      generateHash.mockReturnValue(hashIdMock);
      AuthDao.create.mockResolvedValue(createdUser);

      const result = await AuthService.createUser(mockUser);

      expect(generateHash).toHaveBeenCalled();
      expect(AuthDao.create).toHaveBeenCalledWith({
        ...mockUser,
        id: hashIdMock,
      });
      expect(result).toEqual({ id: hashIdMock });
    });
  });

  describe("updateUsers", () => {
    it("should update a user and return the updated user ID", async () => {
      const mockUser = {
        username: "teste",
        email: "teste@gmail.com",
        password: "teste",
      };
      const updatedUser = { id: hashIdMock };

      AuthDao.update.mockResolvedValue(updatedUser);

      const result = await AuthService.updateUsers(hashIdMock, mockUser);

      expect(AuthDao.update).toHaveBeenCalledWith(hashIdMock, mockUser);
      expect(result).toEqual({ id: hashIdMock });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      await AuthService.deleteUser(hashIdMock);

      expect(AuthDao.delete).toHaveBeenCalledWith(hashIdMock);
    });
  });
});
