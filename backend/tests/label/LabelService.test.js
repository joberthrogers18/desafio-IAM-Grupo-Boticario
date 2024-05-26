const LabelService = require("../../src/services/LabelService");
const LabelDao = require("../../src/daos/LabelDao");
const LabelDto = require("../../src/dtos/LabelDto");

jest.mock("../../src/daos/LabelDao");

describe("Label Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all labels", async () => {
    const mockLabels = [
      {
        id: 1,
        name: "Alta",
      },
      {
        id: 2,
        name: "Media",
      },
      {
        id: 3,
        name: "Baixa",
      },
    ];

    LabelDao.findAll.mockResolvedValue(mockLabels);

    const labels = await LabelService.getAllLabels();

    expect(LabelDao.findAll).toHaveBeenCalledTimes(1);
    expect(labels).toEqual([
      new LabelDto(1, "Alta"),
      new LabelDto(2, "Media"),
      new LabelDto(3, "Baixa"),
    ]);
  });
});
