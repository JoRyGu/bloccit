const User = require('./models').User;
const Post = require('./models').Post;
const Comment = require('./models').Comment;
const bcrypt = require('bcryptjs');

module.exports = {
  async createUser(newUser, callback) {
    try {const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    const user = await User.create({
      email: newUser.email,
      password: hashedPassword
    });
    callback(null, user);
    } catch(err) {
      callback(err);
    } 
  },

  getUser(id, callback) {
    let result = {};
    User.findById(id)
    .then(user => {
      if(!user) {
        callback(404);
      } else {
        result['user'] = user;

        Post.scope({ method: ['lastFiveFor', id]}).all()
        .then(posts => {
          result['posts'] = posts;

          Comment.scope({ method: ['lastFiveFor', id]}).all()
          .then(comments => {
            console.log('WE GOT HERE');
            result['comments'] = comments;
            callback(null, result);
          })
          .catch(err => {
            callback(err);
          })
        })
      }
    })
  }
}