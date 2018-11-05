const Post = require("./models").Post;
const Topic = require("./models").Topic;

module.exports = {
  async addPost(newPost, callback) {
    try {
      const post = await Post.create(newPost);
      callback(null, post);
    } catch (err) {
      callback(err);
    }
  },

  async getPost(id, callback) {
    try {
      const post = await Post.findById(id);
      callback(null, post);
    } catch (err) {
      callback(err);
    }
  },

  async deletePost(id, callback) {
    try {
      const deletedPost = Post.destroy({
        where: { id }
      });
      callback(null, deletedPost);
    } catch (err) {
      callback(err);
    }
  },

  async updatePost(id, updatedPost, callback) {
    try {
      const post = await Post.findById(id);
      if(!post) return callback("Post not found");
      await post.update(updatedPost, { fields: Object.keys(updatedPost) });
      callback(null, post);
    } catch (err) {
      callback(err);
    }
  }
};
