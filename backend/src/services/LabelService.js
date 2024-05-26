const LabelDao = require("../daos/LabelDao");
const LabelDto = require("../dtos/LabelDto");

class LabelService {
  async getAllLabels() {
    const labels = await LabelDao.findAll();
    return labels.map((label) => new LabelDto(label.id, label.name));
  }
}

module.exports = new LabelService();
