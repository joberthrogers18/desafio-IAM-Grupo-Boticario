const StatusCodes = require("../constants/StatusCode");
const ResponseErrorDTO = require("../dtos/ResponseErrorDTO");
const { verifyToken } = require("../utils/auth");

const authMiddleware = (request, reply, done) => {
  const authHeader = request.headers.authorization;

  if (authHeader && authHeader.includes("Berear")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (decoded) {
      request.user = decoded;
      done();
    } else {
      reply
        .status(statusCodes.UNAUTHORIZED)
        .json(
          new ResponseErrorDTO(
            "Você não possui acesso!",
            StatusCodes.UNAUTHORIZED
          )
        );
    }
  } else {
    reply
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        new ResponseErrorDTO(
          "O header 'authorization é obrigatório'!",
          StatusCodes.UNAUTHORIZED
        )
      );
  }
};

module.exports = authMiddleware;
