const AuthDao = require("../daos/AuthDao");
const { generateHash } = require("../utils/encryption");

class AuthService {
  async createUser(body) {
    body.id = generateHash();
    const user = await AuthDao.create(body);
    return {
      id: user.id,
    };
  }

  async updateUsers(id, user) {
    const userUpdated = await AuthDao.update(id, user);

    return {
      id: userUpdated.id,
    };
  }

  async deleteUser(id) {
    await AuthDao.delete(id);
  }
}

module.exports = new AuthService();
