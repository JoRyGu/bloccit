const Advertisement = require('./models').Advertisement;

module.exports = {
  async getAllAdvertisements(callback) {
    try {
      let advertisements = await Advertisement.all();
      callback(null, advertisements);
    } catch(err) {
       callback(err);
    }
  },

  async addAdvertisement(newAd, callback) {
    try {
      let advertisement = await Advertisement.create({
        title: newAd.title,
        description: newAd.description
      });
      callback(null, advertisement);
    } catch (err) {
      callback(err);
    }
  },

  async getAdvertisement(id, callback) {
    try {
      let advertisement = await Advertisement.findById(id);
      callback(null, advertisement);
    } catch(err) {
      callback(err);
    }
  },

  async deleteAd(id, callback) {
    try {
      let advertisement = await Advertisement.destroy({where: {id}});
      callback(null, advertisement);
    } catch(err) {
      callback(err);
    }
  },

  updateAd(id, updatedAd, callback) {
    return Advertisement.findById(id)
      .then(advertisement => {
        if(!advertisement) {
          return callback("Advertisement not found");
        }

        advertisement
          .update(updatedAd, {
            fields: Object.keys(updatedAd)
          })
          .then(() => {
            callback(null, advertisement);
          })
          .catch(err => {
            callback(err);
          })
      })
  }
}