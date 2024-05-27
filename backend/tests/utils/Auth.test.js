const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../../src/utils/auth");

jest.mock("jsonwebtoken");

const hashIdMock =
  "F371BC4A311F2B009EEF952DD83CA80E2B60026C8E935592D0F9C308453C813E";

const expectedToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUxMjM0YWUyMGM0ZWJmNTBlZGRiMWY5MmQwZDEyZDg1MDMzNDg1MWJiZmJjYTBkZGVlMDM0OTYwOGQ5MjcwY2UiLCJ1c2VybmFtZSI6ImpvYmVydGgiLCJlbWFpbCI6ImpvYmVydGgucm9nZXJzMThAZ21haWwuY29tIiwiaWF0IjoxNzE2ODA1ODQ2LCJleHAiOjE3MTc0MTA2NDZ9.9CTNb_UgOAW_OdAUkGmzNvXNfoHgdcA1mIYgmid-cOU";

describe("AuthUtils", () => {
  describe("generateToken", () => {
    it("should generate a JWT token", () => {
      const user = {
        id: hashIdMock,
        username: "teste",
        email: "teste@gmail.com",
      };

      jwt.sign.mockReturnValue(expectedToken);

      const token = generateToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: hashIdMock, username: "teste", email: "teste@gmail.com" },
        "test",
        { expiresIn: "7d" }
      );
      expect(token).toBe(expectedToken);
    });
  });

  describe("verifyToken", () => {
    it("should return decoded user data if token is valid", () => {
      const token = "valid_token";
      const expectedUserData = {
        id: hashIdMock,
        username: "teste",
        email: "teste@gmail.com",
      };

      jwt.verify.mockReturnValue(expectedUserData);

      const decodedUserData = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith("valid_token", "test");
      expect(decodedUserData).toEqual(expectedUserData);
    });

    it("should return null if token is invalid", () => {
      const token = "invalid_token";

      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const decodedUserData = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith("invalid_token", "test"); // Replace with your secret
      expect(decodedUserData).toBeNull();
    });
  });
});
