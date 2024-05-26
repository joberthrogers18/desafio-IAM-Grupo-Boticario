const User = require("../models/UserModel");

class AuthDao {
  async create(user) {
    return User.create(user);
  }

  async update(id, newUserData) {
    const userData = await User.findByPk(id);
    const updatedUser = await userData.update(newUserData);
    return updatedUser;
  }

  async delete(id) {
    await User.destroy({
      where: {
        id,
      },
    });
  }
}

module.exports = new AuthDao();
