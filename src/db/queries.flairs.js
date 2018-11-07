const Topic = require('./models').Topic;
const Post = require('./models').Post;
const Flair = require('./models').Flair;

module.exports = {
  async addFlair(newFlair, callback) {
    try {
      const flair = await Flair.create(newFlair);
      callback(null, flair);
    } catch (err) {
      callback(err);
    }
  },

  async getFlair(id, callback) {
    try {
      const flair = await Flair.findById(id);
      callback(null, flair);
    } catch (err) {
      callback(err);
    }
  },

  async deleteFlair(id, callback) {
    try {
      const deletedFlair = await Flair.destroy({
        where: {
          id
        }
      });
      callback(null, deletedFlair);
    } catch (err) {
      callback(err);
    }
  },

  async updateFlair(id, updatedFlair, callback) {
    try {
      const flair = await Flair.findById(id);
      if (!flair) return callback("Flair not found");
      await flair.update(updatedFlair, {
        fields: Object.keys(updatedFlair)
      });
      callback(null, flair);
    } catch (err) {
      callback(err);
    }
  }
};