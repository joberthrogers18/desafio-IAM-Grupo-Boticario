const crypto = require("crypto");
const bcrypt = require("bcrypt");

function generateHash() {
  const hash = crypto.createHash("sha256");
  hash.update(Date.now().toString());
  return hash.digest("hex");
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { generateHash, hashPassword, verifyPassword };
