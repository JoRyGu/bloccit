const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;

const sequelize = require('../../src/db/models/index').sequelize
const base = "http://localhost:3000/topics/";
const request = require('request');
const server = require('../../src/server');

describe("routes : flairs", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({
        force: true
      })
      .then(res => {
        Topic.create({
          title: "This is a Test Topic",
          description: "This is a test topic's description"
        }).then(topic => {
          this.topic = topic;

          Post.create({
            title: "This is a Test Post",
            body: "This is a test post's body",
            topicId: this.topic.id
          }).then(post => {
            this.post = post;

            Flair.create({
              name: "Sad",
              color: "Blue",
              postId: this.post.id
            }).then(flair => {
              this.flair = flair;
              done();
            }).catch(err => {
              console.log(err);
              done();
            });
          });
        });
      });
  });

  describe("GET /topics/:topicId/posts/:id/flairs/new", () => {
    it("should render a new flair form", done => {
      request.get(`${base}${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      })
    })
  });

  describe("POST /topics/:topicId/posts/:id/flairs/create", () => {
    it("should create a new flair and redirect", done => {
      const options = {
        url: `${base}${this.topic.id}/posts/${this.post.id}/flairs/create`,
        form: {
          name: "Another New Flair",
          color: "Red"
        }
      };
      request.post(options, (req, res, body) => {
        Flair.findOne({
            where: {
              name: "Another New Flair"
            }
          })
          .then(flair => {
            expect(flair).not.toBeNull();
            expect(flair.name).toBe("Another New Flair");
            expect(flair.color).toBe("Red");
            done();
          }).catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id/flairs/:flairId", () => {
    it("should render a view displaying the selected flair", done => {
      request.get(`${base}${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sad");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/flairs/:flairId/destroy", () => {
    it("should delete the currently displayed flair", done => {
      expect(this.post.id).toBe(1);
      request.post(`${base}${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/destroy`, (err, res, body) => {
        Flair.findById(this.flair.id).then(flair => {
          expect(err).toBeNull();
          expect(flair).toBeNull();
          done();
        });
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id/flairs/:flairId/edit", () => {
    it("should render a view with an edit flair form", done => {
      request.get(`${base}${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/flairs/:flairId/update", () => {
    it("should update the selected flair with the new information", done => {
      let options = {
        url: `${base}${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`, 
        form: {
          name: "Updated Flair Name"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Flair.findOne({where: {id: this.flair.id}}).then(flair => {
          expect(flair.name).toBe("Updated Flair Name");
          done();
        });
      });
    });
  });
});