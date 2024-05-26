const LabelDao = require("../../src/daos/LabelDao");
const Label = require("../../src/models/LabelModel");

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

jest.mock("../../src/models/LabelModel");

describe("LabelDao", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find all labels", async () => {
    Label.findAll.mockResolvedValue(mockLabels);
    const labels = await LabelDao.findAll();
    expect(Label.findAll).toHaveBeenCalledTimes(1);
    expect(labels).toEqual(mockLabels);
  });
});
