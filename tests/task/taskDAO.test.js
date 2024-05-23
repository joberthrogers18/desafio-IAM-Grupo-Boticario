const TaskDao = require("../../src/daos/TaskDao");
const Task = require("../../src/models/TaskModel");
const NotFoundException = require("../../src/exceptions/NotFoundException");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

const mockTask = {
  id: hashIdMock,
  title: "Titulo da Tarefa",
  description: "Descrição da Tarefa",
  completed: false,
};

jest.mock("../../src/models/TaskModel");

describe("TaskDao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find all tasks", async () => {
    Task.findAll.mockResolvedValue([mockTask]);
    const tasks = await TaskDao.findAll();
    expect(Task.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([mockTask]);
  });

  it("should find all by key searched", async () => {
    Task.findAll.mockResolvedValue([mockTask]);
    const tasks = await TaskDao.findByKey("isCompleted", true);
    expect(Task.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([mockTask]);
  });

  it("should find a task by id", async () => {
    Task.findByPk.mockResolvedValue(mockTask);
    const task = await TaskDao.findById(hashIdMock);
    expect(Task.findByPk).toHaveBeenCalledWith(hashIdMock);
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

    expect(Task.findByPk).toHaveBeenCalledWith(hashIdMock);
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
    const mockTask = {
      id: 1,
      title: "Delete Task",
      description: "Delete Description",
      completed: false,
    };
    Task.findByPk.mockResolvedValue(mockTask);
    mockTask.destroy = jest.fn().mockResolvedValue(mockTask);

    const deletedTask = await TaskDao.delete(1);

    expect(Task.findByPk).toHaveBeenCalledWith(1);
    expect(mockTask.destroy).toHaveBeenCalled();
    expect(deletedTask).toEqual(mockTask);
  });

  it("should throw NotFoundException if task to delete is not found", async () => {
    Task.findByPk.mockResolvedValue(null);

    await expect(TaskDao.delete(1)).rejects.toThrow(NotFoundException);
  });
});
