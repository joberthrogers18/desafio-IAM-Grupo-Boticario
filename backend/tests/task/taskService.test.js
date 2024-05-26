const TaskService = require("../../src/services/TaskService");
const TaskDao = require("../../src/daos/TaskDao");
const TaskDto = require("../../src/dtos/TaskDto");

const hashIdsMock = [
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E",
  "C8CC3EBD6C5385086DA49D890780E41F0AA3D3FD21793E551828EFBCCEC5284C",
];

jest.mock("../../src/daos/TaskDao");

describe("Task Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all tasks", async () => {
    const mockTasks = [
      {
        id: hashIdsMock[0],
        title: "Titulo da minha tarefa 1",
        description: "Descrição da minha tarefa 1",
        isCompleted: false,
        creationDate: "12-05-2023",
        modifiedDate: "12-05-2024",
        isCompleted: false,
        LabelId: 1,
        Label: {
          name: "Alta",
        },
      },
      {
        id: hashIdsMock[1],
        title: "Titulo da minha tarefa 2",
        description: "Descrição da minha tarefa 2",
        isCompleted: true,
        creationDate: "12-05-2023",
        modifiedDate: "12-05-2024",
        LabelId: 2,
        Label: {
          name: "Media",
        },
      },
    ];
    TaskDao.findAll.mockResolvedValue(mockTasks);

    const tasks = await TaskService.getAllTasks();

    expect(TaskDao.findAll).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([
      new TaskDto(
        hashIdsMock[0],
        "Titulo da minha tarefa 1",
        "Descrição da minha tarefa 1",
        false,
        "12-05-2023",
        "12-05-2024",
        1,
        "Alta"
      ),
      new TaskDto(
        hashIdsMock[1],
        "Titulo da minha tarefa 2",
        "Descrição da minha tarefa 2",
        true,
        "12-05-2023",
        "12-05-2024",
        2,
        "Media"
      ),
    ]);
  });

  it("should get all tasks searched by id", async () => {
    const mockTasks = {
      id: hashIdsMock[0],
      title: "Titulo da minha tarefa 1",
      description: "Descrição da minha tarefa 1",
      creationDate: "12-05-2023",
      modifiedDate: "12-05-2024",
      isCompleted: false,
      LabelId: 1,
      Label: {
        name: "Alta",
      },
    };

    TaskDao.findById.mockResolvedValue(mockTasks);
    const tasks = await TaskService.getTaskById(hashIdsMock[0]);

    expect(TaskDao.findById).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual(
      new TaskDto(
        hashIdsMock[0],
        "Titulo da minha tarefa 1",
        "Descrição da minha tarefa 1",
        false,
        "12-05-2023",
        "12-05-2024",
        1,
        "Alta"
      )
    );
  });

  it("should get all tasks completed", async () => {
    const mockTasks = [
      {
        id: hashIdsMock[0],
        title: "Titulo da minha tarefa 1",
        description: "Descrição da minha tarefa 1",
        isCompleted: false,
        LabelId: 1,
        creationDate: "12-05-2016",
        modifiedDate: "12-05-2015",
        Label: {
          name: "Alta",
        },
      },
    ];

    TaskDao.findByKey.mockResolvedValue(mockTasks);
    const tasks = await TaskService.getTaskByCompletion(true);

    expect(TaskDao.findByKey).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([
      new TaskDto(
        hashIdsMock[0],
        "Titulo da minha tarefa 1",
        "Descrição da minha tarefa 1",
        false,
        "12-05-2016",
        "12-05-2015",
        1,
        "Alta"
      ),
    ]);
  });

  it("should create a task", async () => {
    const taskDto = new TaskDto(
      null,
      "Titulo da minha tarefa",
      "Descrição da minha tarefa",
      false
    );
    const mockTask = {
      id: hashIdsMock[0],
      title: "Titulo da minha tarefa",
      description: "Descrição da minha tarefa",
      isCompleted: false,
    };
    TaskDao.create.mockResolvedValue(mockTask);

    const createdTask = await TaskService.createTask(taskDto);

    expect(TaskDao.create).toHaveBeenCalledWith(taskDto);
    expect(createdTask).toEqual(
      new TaskDto(
        hashIdsMock[0],
        "Titulo da minha tarefa",
        "Descrição da minha tarefa",
        false
      )
    );
  });

  it("should update a task", async () => {
    const taskDto = new TaskDto(
      hashIdsMock[0],
      "Titulo atualizado",
      "Descrição atualizada",
      true
    );
    const mockTask = {
      id: hashIdsMock[0],
      title: "Titulo atualizado",
      description: "Descrição atualizada",
      isCompleted: true,
    };
    TaskDao.update.mockResolvedValue(mockTask);

    const updatedTask = await TaskService.updateTask(hashIdsMock[0], taskDto);

    expect(TaskDao.update).toHaveBeenCalledWith(hashIdsMock[0], taskDto);
    expect(updatedTask).toEqual(
      new TaskDto(
        hashIdsMock[0],
        "Titulo atualizado",
        "Descrição atualizada",
        true
      )
    );
  });

  it("should delete a task", async () => {
    await TaskService.deleteTask(hashIdsMock[0]);
    expect(TaskDao.delete).toHaveBeenCalledWith(hashIdsMock[0]);
  });
});
