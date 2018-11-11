const Topic = require("./models").Topic;
const Post = require("./models").Post;
const Authorizer = require('../policies/topic');

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

  deleteTopic(req, callback) {
    return Topic.findById(req.params.id)
    .then(topic => {
      const authorized = new Authorizer(req.user, topic).destroy();

      if(authorized) {
        topic.destroy()
        .then(res => {
          callback(null, topic);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch(err => {
      callback(err);
    })
  },

  updateTopic(req, updatedTopic, callback) {
    return Topic.findById(req.params.id)
    .then(topic => {
      if(!topic) {
        return callback("Topic not found");
      }

      const authorized = new Authorizer(req.user, topic).update();

      if(authorized) {
        topic.update(updatedTopic, {
          fields: Object.keys(updatedTopic)
        })
        .then(() => {
          callback(null, topic);
        })
        .catch(err => {
          callback(err);
        })
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  }
};
