const LabelController = require("../../src/controllers/LabelController");
const LabelService = require("../../src/services/LabelService");
const StatusCode = require("../../src/constants/StatusCode");
const ResponseDTO = require("../../src/dtos/ResponseDTO");
const ResponseErrorDTO = require("../../src/dtos/ResponseErrorDTO");

jest.mock("../../src/services/LabelService");

describe("Task Controller", () => {
  let request;
  let reply;

  beforeEach(() => {
    request = { body: {}, params: {}, query: {} };
    reply = {
      code: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllTask", () => {
    it("should get all tasks and return response with status 200", async () => {
      const mockTasks = [
        {
          id: 1,
          nome: "Alta",
        },
        {
          id: 2,
          nome: "Media",
        },
        {
          id: 3,
          nome: "Baixa",
        },
      ];
      LabelService.getAllLabels.mockResolvedValue(mockTasks);

      await LabelController.getAllLabels(request, reply);

      expect(LabelService.getAllLabels).toHaveBeenCalled();
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseDTO(mockTasks, "").buildResponseObject()
      );
    });

    it("should return 500 if there is an error", async () => {
      LabelService.getAllLabels.mockRejectedValue(
        new Error("Erro na base de dados")
      );

      await LabelController.getAllLabels(request, reply);

      expect(reply.status).toHaveBeenCalledWith(
        StatusCode.INTERNAL_SERVER_ERROR
      );
      expect(reply.send).toHaveBeenCalledWith(
        new ResponseErrorDTO(
          "Não foi possível recuperar as etiquetas listadas. Por favor tente novamente mais tarde",
          StatusCode.INTERNAL_SERVER_ERROR
        ).buildResponseObject()
      );
    });
  });
});
