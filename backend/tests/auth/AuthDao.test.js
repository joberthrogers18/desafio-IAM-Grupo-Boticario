const AuthDao = require("../../src/daos/AuthDao");
const User = require("../../src/models/UserModel");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

const mockUser = {
  id: hashIdMock,
  email: "teste@gmail.com",
  username: "teste",
  password: "teste",
};

jest.mock("../../src/models/UserModel");

describe("AuthDao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    User.create.mockResolvedValue(mockUser);
    const createdUser = await AuthDao.create(mockUser);
    expect(User.create).toHaveBeenCalledWith(mockUser);
    expect(createdUser).toEqual(mockUser);
  });

  it("should update a user", async () => {
    const updatedMockUser = {
      id: hashIdMock,
      email: "teste2@gmail.com",
      username: "teste2",
      password: "teste2",
    };
    User.findByPk.mockResolvedValue({
      ...mockUser,
      update: jest.fn().mockResolvedValue(updatedMockUser),
    });

    const updatedTask = await AuthDao.update(hashIdMock, updatedMockUser);

    expect(updatedTask).toEqual(updatedMockUser);
  });

  it("should delete a task", async () => {
    User.destroy = jest.fn().mockResolvedValue({});
    await AuthDao.delete(hashIdMock);

    expect(User.destroy).toHaveBeenCalled();
  });
});
