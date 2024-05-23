const TodoDao = require("../../src/daos/todoDao");
const Todo = require("../../src/models/todoModel");
const NotFoundException = require("../../src/exceptions/NotFoundException");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

const mockTodo = {
  id: hashIdMock,
  title: "Titulo da Tarefa",
  description: "Descrição da Tarefa",
  completed: false,
};

jest.mock("../../src/models/todoModel");

describe("TodoDao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find all todos", async () => {
    Todo.findAll.mockResolvedValue([mockTodo]);
    const todos = await TodoDao.findAll();
    expect(Todo.findAll).toHaveBeenCalledTimes(1);
    expect(todos).toEqual([mockTodo]);
  });

  it("should find a todo by id", async () => {
    Todo.findByPk.mockResolvedValue(mockTodo);
    const todo = await TodoDao.findById(hashIdMock);
    expect(Todo.findByPk).toHaveBeenCalledWith(hashIdMock);
    expect(todo).toEqual(mockTodo);
  });

  it("should create a new todo", async () => {
    Todo.create.mockResolvedValue(mockTodo);
    const createdTodo = await TodoDao.create(mockTodo);
    expect(Todo.create).toHaveBeenCalledWith(mockTodo);
    expect(createdTodo).toEqual(mockTodo);
  });

  it("should update a todo", async () => {
    Todo.findByPk.mockResolvedValue(mockTodo);
    mockTodo.update = jest.fn().mockResolvedValue(mockTodo);

    const updatedMockTodo = {
      id: hashIdMock,
      title: "Updated Todo",
      description: "Updated Description",
      completed: true,
    };

    const updatedTodo = await TodoDao.update(hashIdMock, updatedMockTodo);

    expect(Todo.findByPk).toHaveBeenCalledWith(hashIdMock);
    expect(mockTodo.update).toHaveBeenCalledWith(updatedMockTodo);
    expect(updatedTodo).toEqual(mockTodo);
  });

  it("should throw NotFoundException if todo to update is not found", async () => {
    Todo.findByPk.mockResolvedValue(null);

    await expect(TodoDao.update(1, { title: "Updated Todo" })).rejects.toThrow(
      NotFoundException
    );
  });

  it("should delete a todo", async () => {
    const mockTodo = {
      id: 1,
      title: "Delete Todo",
      description: "Delete Description",
      completed: false,
    };
    Todo.findByPk.mockResolvedValue(mockTodo);
    mockTodo.destroy = jest.fn().mockResolvedValue(mockTodo);

    const deletedTodo = await TodoDao.delete(1);

    expect(Todo.findByPk).toHaveBeenCalledWith(1);
    expect(mockTodo.destroy).toHaveBeenCalled();
    expect(deletedTodo).toEqual(mockTodo);
  });

  it("should throw NotFoundException if todo to delete is not found", async () => {
    Todo.findByPk.mockResolvedValue(null);

    await expect(TodoDao.delete(1)).rejects.toThrow(NotFoundException);
  });
});
