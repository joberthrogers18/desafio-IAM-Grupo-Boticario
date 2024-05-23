const crypto = require("crypto");

// TODO: test this function

function generateHash() {
  const hash = crypto.createHash("sha256");
  hash.update(Date.now().toString());
  return hash.digest("hex");
}

module.exports = { generateHash };
