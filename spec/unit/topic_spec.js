const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true})
    .then(res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then(user => {
        this.user = user;

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then(topic => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        })
      })
    });
  });

  describe("#create()", () => {
    it("should create a topic and store it in the database", done => {
      Topic.create({
        title: "This is a New Title",
        description: "This is a new description",
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
        topicId: this.topic.id,
        userId: this.user.id
      })
      .then(post => {
        this.topic.getPosts()
        .then(posts => {
          expect(posts[1].dataValues.title).toBe(post.title);
          expect(posts[1].dataValues.body).toBe(post.body);
          expect(posts[1].dataValues.topicId).toBe(this.topic.id);
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
