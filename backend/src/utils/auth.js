const jwt = require("jsonwebtoken");
const secret = "your_jwt_secret";

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
