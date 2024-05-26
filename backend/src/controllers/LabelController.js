const StatusCode = require("../constants/StatusCode");
const ResponseDTO = require("../dtos/ResponseDTO");
const ResponseErrorDTO = require("../dtos/ResponseErrorDTO");
const LabelService = require("../services/LabelService");

class LabelController {
  async getAllLabels(request, reply) {
    try {
      const labels = await LabelService.getAllLabels();
      return reply
        .status(StatusCode.SUCCESS)
        .send(new ResponseDTO(labels, "").buildResponseObject());
    } catch (error) {
      console.log("error: ", error);

      return reply
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .send(
          new ResponseErrorDTO(
            "Não foi possível recuperar as etiquetas listadas. Por favor tente novamente mais tarde",
            StatusCode.INTERNAL_SERVER_ERROR
          ).buildResponseObject()
        );
    }
  }
}

module.exports = new LabelController();
