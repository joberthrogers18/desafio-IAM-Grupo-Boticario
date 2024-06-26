const TaskDao = require("../../src/daos/TaskDao");
const Task = require("../../src/models/TaskModel");
const NotFoundException = require("../../src/exceptions/NotFoundException");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

const mockTask = {
  id: hashIdMock,
  title: "Titulo da Tarefa",
  description: "Descrição da Tarefa",
  isCompleted: false,
};

jest.mock("../../src/models/TaskModel");

describe("TaskDao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find all tasks", async () => {
    Task.findAll.mockResolvedValue([mockTask]);
    const tasks = await TaskDao.findAll({ LabelId: 1, isCompleted: false });
    expect(Task.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([mockTask]);
  });

  it("should find all tasks but without filters", async () => {
    Task.findAll.mockResolvedValue([mockTask]);
    const tasks = await TaskDao.findAll({ isCompleted: null });
    expect(Task.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([mockTask]);
  });

  it("should find a task by id", async () => {
    Task.findByPk.mockResolvedValue(mockTask);
    const task = await TaskDao.findById(hashIdMock);
    expect(Task.findByPk).toHaveBeenCalledWith(hashIdMock, expect.anything());
    expect(task).toEqual(mockTask);
  });

  it("should create a new task", async () => {
    Task.create.mockResolvedValue(mockTask);
    const createdTask = await TaskDao.create(mockTask);
    expect(Task.create).toHaveBeenCalledWith(mockTask);
    expect(createdTask).toEqual(mockTask);
  });

  it("should update a task", async () => {
    Task.findByPk.mockResolvedValue(mockTask);
    mockTask.update = jest.fn().mockResolvedValue(mockTask);

    const updatedMockTask = {
      id: hashIdMock,
      title: "Updated Task",
      description: "Updated Description",
      completed: true,
    };

    const updatedTask = await TaskDao.update(hashIdMock, updatedMockTask);

    expect(Task.findByPk).toHaveBeenCalledWith(hashIdMock, expect.anything());
    expect(mockTask.update).toHaveBeenCalledWith(updatedMockTask);
    expect(updatedTask).toEqual(mockTask);
  });

  it("should throw NotFoundException if task to update is not found", async () => {
    Task.findByPk.mockResolvedValue(null);

    await expect(TaskDao.update(1, { title: "Updated Task" })).rejects.toThrow(
      NotFoundException
    );
  });

  it("should delete a task", async () => {
    Task.destroy = jest.fn().mockResolvedValue({});
    await TaskDao.delete(hashIdMock);

    expect(Task.destroy).toHaveBeenCalled();
  });
});
