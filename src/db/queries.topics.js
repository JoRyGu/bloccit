const Topic = require("./models").Topic;
const Post = require("./models").Post;

module.exports = {
  async getAllTopics(callback) {
    try {
      let topics = await Topic.all();
      callback(null, topics);
    } catch (err) {
      callback(err);
    }
  },

  async addTopic(newTopic, callback) {
    try {
      let topic = await Topic.create({
        title: newTopic.title,
        description: newTopic.description
      });
      callback(null, topic);
    } catch (err) {
      callback(err);
    }
  },

  async getTopic(id, callback) {
    try {
      let topic = await Topic.findById(id, {
        include: [
          {
            model: Post,
            as: "posts"
          }
        ]
      });
      callback(null, topic);
    } catch (err) {
      callback(err);
    }
  },

  async deleteTopic(id, callback) {
    try {
      let topic = await Topic.destroy({ where: { id } });
      callback(null, topic);
    } catch (err) {
      callback(err);
    }
  },

  async updateTopic(id, updatedTopic, callback) {
    try {
      const topic = await Topic.findById(id);
      if (!topic) return callback("Topic not found");
      await topic.update(updatedTopic, { fields: Object.keys(updatedTopic) });
      callback(null, topic);
    } catch (err) {
      callback(err);
    }
  }
};
