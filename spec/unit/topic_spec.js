const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    sequelize
      .sync({ force: true })
      .then(res => {
        Topic.create({
          title: "This is a Title",
          description: "This is a description"
        }).then(topic => {
          this.topic = topic;
          done();
        });
      })
      .catch(err => {
        console.log(err);
        done();
      });
  });

  describe("#create()", () => {
    it("should create a topic and store it in the database", done => {
      Topic.create({
        title: "This is a New Title",
        description: "This is a new description"
      })
        .then(topic => {
          expect(topic.title).toBe("This is a New Title");
          expect(topic.description).toBe("This is a new description");
          done();
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#getPosts", () => {
    it("should fetch all posts attached to specified Topic", done => {
      Post.create({
        title: "New Post",
        body: "Post body",
        topicId: this.topic.id
      })
      .then(post => {
        this.topic.getPosts()
        .then(posts => {
          expect(posts[0].dataValues.title).toBe(post.title);
          expect(posts[0].dataValues.body).toBe(post.body);
          expect(posts[0].dataValues.topicId).toBe(this.topic.id);
          done();
        })
      })
      .catch(err => {
        console.log(err);
        done();
      })
    });
  });
});
