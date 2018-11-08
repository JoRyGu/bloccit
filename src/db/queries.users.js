const User = require('./models').User;
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
  }
}