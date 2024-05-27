const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_JWT || "test";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    secret,
    {
      expiresIn: "7d",
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
