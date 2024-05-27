// tests/utils.test.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const {
  generateHash,
  hashPassword,
  verifyPassword,
} = require("../../src/utils/encryption");

jest.useFakeTimers().setSystemTime(new Date("2023-01-01T00:00:00Z"));

describe("Utility Functions", () => {
  describe("generateHash", () => {
    it("should generate a valid SHA-256 hash", () => {
      const hash = generateHash();
      const expectedHash = crypto
        .createHash("sha256")
        .update(Date.now().toString())
        .digest("hex");
      expect(hash).toBe(expectedHash);
    });
  });

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "securepassword";
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBe(true);
    });
  });

  describe("verifyPassword", () => {
    it("should verify the hashed password correctly", async () => {
      const password = "securepassword";
      const hashedPassword = await hashPassword(password);
      const isMatch = await verifyPassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it("should return false for incorrect password", async () => {
      const password = "securepassword";
      const hashedPassword = await hashPassword(password);
      const isMatch = await verifyPassword("wrongpassword", hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
