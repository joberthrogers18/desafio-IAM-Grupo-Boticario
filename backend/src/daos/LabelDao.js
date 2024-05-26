const Label = require("../models/LabelModel");

class LabelDao {
  async findAll() {
    return await Label.findAll({});
  }
}

module.exports = new LabelDao();
