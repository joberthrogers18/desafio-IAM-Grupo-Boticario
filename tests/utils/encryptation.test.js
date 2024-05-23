const Encryption = require("../../src/utils/encryption");

describe("Encryption Util", () => {
  it("should generate an hash", async () => {
    const hashGenerateSpy = jest.spyOn(Encryption, "generateHash");
    const hash = Encryption.generateHash();
    expect(hashGenerateSpy).toHaveBeenCalledTimes(1);
    expect(hashGenerateSpy).toHaveBeenCalledWith();
    expect(typeof hash === "string").toBe(true);
  });
});
