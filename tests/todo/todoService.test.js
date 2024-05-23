const TodoService = require("../../src/services/todoService");
const todoDao = require("../../src/daos/todoDao");
const TodoDto = require("../../src/dtos/todoDto");

const hashIdsMock = [
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E",
  "C8CC3EBD6C5385086DA49D890780E41F0AA3D3FD21793E551828EFBCCEC5284C",
];

jest.mock("../../src/daos/todoDao");

describe("Todo Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all todos", async () => {
    const mockTodos = [
      {
        id: hashIdsMock[0],
        title: "Titulo da minha tarefa 1",
        description: "Descrição da minha tarefa 1",
        isCompleted: false,
      },
      {
        id: hashIdsMock[1],
        title: "Titulo da minha tarefa 2",
        description: "Descrição da minha tarefa 2",
        isCompleted: true,
      },
    ];
    todoDao.findAll.mockResolvedValue(mockTodos);

    const todos = await TodoService.getAllTodos();

    expect(todoDao.findAll).toHaveBeenCalledTimes(1);
    expect(todos).toEqual([
      new TodoDto(
        hashIdsMock[0],
        "Titulo da minha tarefa 1",
        "Descrição da minha tarefa 1",
        false
      ),
      new TodoDto(
        hashIdsMock[1],
        "Titulo da minha tarefa 2",
        "Descrição da minha tarefa 2",
        true
      ),
    ]);
  });

  it("should create a todo", async () => {
    const todoDto = new TodoDto(
      null,
      "Titulo da minha tarefa",
      "Descrição da minha tarefa",
      false
    );
    const mockTodo = {
      id: hashIdsMock[0],
      title: "Titulo da minha tarefa",
      description: "Descrição da minha tarefa",
      isCompleted: false,
    };
    todoDao.create.mockResolvedValue(mockTodo);

    const createdTodo = await TodoService.createTodo(todoDto);

    expect(todoDao.create).toHaveBeenCalledWith(todoDto);
    expect(createdTodo).toEqual(
      new TodoDto(
        hashIdsMock[0],
        "Titulo da minha tarefa",
        "Descrição da minha tarefa",
        false
      )
    );
  });

  it("should update a todo", async () => {
    const todoDto = new TodoDto(
      hashIdsMock[0],
      "Titulo atualizado",
      "Descrição atualizada",
      true
    );
    const mockTodo = {
      id: hashIdsMock[0],
      title: "Titulo atualizado",
      description: "Descrição atualizada",
      isCompleted: true,
    };
    todoDao.update.mockResolvedValue(mockTodo);

    const updatedTodo = await TodoService.updateTodo(hashIdsMock[0], todoDto);

    expect(todoDao.update).toHaveBeenCalledWith(hashIdsMock[0], todoDto);
    expect(updatedTodo).toEqual(
      new TodoDto(
        hashIdsMock[0],
        "Titulo atualizado",
        "Descrição atualizada",
        true
      )
    );
  });

  it("should delete a todo", async () => {
    await TodoService.deleteTodo(hashIdsMock[0]);
    expect(todoDao.delete).toHaveBeenCalledWith(hashIdsMock[0]);
  });
});
