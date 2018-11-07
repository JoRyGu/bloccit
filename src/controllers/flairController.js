const flairQueries = require('../db/queries.flairs');
const postQueries = require('../db/queriess.posts');
const topicQueries = require('../db/queries.topics');

module.exports = {
  new(req, res, next) {
    const ids = {};
    postQueries.getPost(req.params.id, (err, post) => {
      ids.postId = post.id;
      ids.topicId = post.topicId;
    }).then(() => {
      res.render("flairs/new", {
        ids
      });
    }).catch(err => {
      console.log(err);
    });
  },

  create(req, res, next) {
    let topicId;
    let postId;
    let newFlair = {
      name: req.body.name,
      color: req.body.color,
      postId: req.params.id
    };
    postQueries.getPost(req.params.id, (err, post) => {
      topicId = post.topicId;
      postId = post.id;
    }).then(post => {
      flairQueries.addFlair(newFlair, (err, flair) => {
        if (err) {
          console.log(err);
          res.redirect(500, "/flairs/new");
        } else {
          res.redirect(303, `/topics/${topicId}/posts/${postId}`)
        }
      })
    }).catch(err => {
      console.log(err);
    });
  },

  show(req, res, next) {
    const models = {};
    topicQueries.getTopic(req.params.topicId, (err, topic) => {
      models.topic = topic;
    }).then(() => {
      postQueries.getPost(req.params.id, (err, post) => {
        models.post = post;
      }).then(() => {
        flairQueries.getFlair(req.params.flairId, (err, flair) => {
          models.flair = flair;
          if(err || flair == null) {
            res.redirect(404, "/");
          } else {
            res.render("flairs/show", { models });
          }
        });
      });
    });
  }, 

  destroy(req, res, next) {
    flairQueries.deleteFlair(req.params.flairId, (err, deletedRecordsCount) => {
      if(err) {
        res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.id}/flairs/${req.params.flairId}`);
      } else {
        res.redirect(303, `/topics/${req.params.topicId}/posts/${req.params.id}`);
      }
    })
  },

  edit(req, res, next) {
    const models = {
      topicId: req.params.topicId,
      postId: req.params.id,
      flairId: req.params.flairId
    }
    flairQueries.getFlair(models.flairId, (err, flair) => {
      if(err || flair == null) {
        res.redirect(404, "/");
      } else {
        res.render("flairs/edit", { models });
      }
    });
  },

  update(req, res, next) {
    flairQueries.updateFlair(req.params.flairId, req.body, (err, flair) => {
      if(err || flair == null) {
        res.redirect(404, `/topics/${req.params.topidId}/posts/${req.params.id}/flairs/${req.params.flairId}/edit`);
      } else {
        res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}/`);
      }
    })
  }
}