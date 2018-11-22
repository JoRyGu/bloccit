const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({ force: true }).then(() => {
      User.create({
        email: "josh@fake.net",
        password: "123456"
      }).then(user => {
        this.user = user;

        Topic.create({
          title: "New Topic Title",
          description: "This is the new topic's description"
        }).then(topic => {
          this.topic = topic;

          Post.create({
            title: "New Post Title",
            body: "This is the new post's body",
            topicId: this.topic.id,
            userId: this.user.id
          }).then(post => {
            this.post = post;

            done();
          });
        });
      });
    });
  });

  // guest user context (not signed in)
  describe("CRUD actions taken by a guest user", () => {
    beforeEach(done => {
      request.get({
        url: 'http://localhost:3000/auth/fake',
        form: {
          id: 0
        }
      }, (err, res, body) => {
        done();
      });
    });

    // get show (not signed in)
    describe("GET /topics/:topicId/posts/:id - guest", () => {
      it("should render a view of the post described by the id", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Post Title");
            expect(body).toContain("This is the new post");
            done();
          }
        );
      });
    });

    // get new (not signed in)
    describe("GET /topics/:topicId/posts/new - guest", () => {
      it("should redirect guest user to the sign in view", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Sign In");
          done();
        });
      });
    });

    // post create (not signed in)
    describe("POST /topics/:topicId/posts/create - guest", () => {
      it("should not create a new post", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Hello There",
            body: "I have not heard that name since the Clone Wars"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "Hello There" } }).then(post => {
            expect(err).toBeNull();
            expect(post).toBeNull();
            done();
          });
        });
      });
    });

    // get edit (not signed in)
    describe("GET /topics/:topicId/posts/:id/edit - guest", () => {
      it("should redirect the guest user back to the sign in view", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Post Title");
            expect(body).toContain("Edit");
            expect(body).toContain("Delete");
            expect(body).toContain("This is the new post");
            done();
          }
        );
      });
    });

    // post update (not signed in)
    describe("POST /topics/:topicId/posts/:id/update - guest", () => {
      it("should not update the existing post", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Scruffy Looking Nerf Herder"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findOne({ where: { id: this.post.id } }).then(post => {
            expect(err).toBeNull();
            expect(this.post.title).toBe("New Post Title");
            done();
          });
        });
      });
    });

    // post destroy (not signed in)
    describe("POST /topics/:topicId/posts/:id/destroy - guest", () => {
      it("should not destroy the existing post", done => {
        request.post(
          `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
          (err, res, body) => {
            expect(err).toBeNull();
            Post.findById(this.topic.id).then(post => {
              expect(post).not.toBeNull();
              done();
            });
          }
        );
      });
    });
  });

  // correct member user context (signed in but not admin)
  describe("CRUD operations by a member user", () => {
    beforeEach(done => {
      request.get(
        {
          url: "http://localhost:3000/auth/fake",
          form: {
            id: this.user.id,
            email: "josh@fake.net",
            role: "member"
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    // get new (signed in - member)
    describe("GET /topics/:topicId/posts/new - member", () => {
      it("should render a new post view for the member user", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Post");
          done();
        });
      });
    });

    // post create (signed in - member)
    describe("POST /topics/:topicId/posts/create - member", () => {
      it("should create a new post connected to the member for the current topic", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Obi-Wan Kenobi",
            body: "He's the best Jedi"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "Obi-Wan Kenobi" } }).then(post => {
            expect(post).not.toBeNull();
            expect(post.title).toBe("Obi-Wan Kenobi");
            expect(post.body).toBe("He's the best Jedi");
          });
          done();
        });
      });
    });

    // get edit (signed in - member)
    describe("GET /topics/:topicId/posts/:id/edit - member", () => {
      it("should render edit view if member is the same  one that created post", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Post");
            done();
          }
        );
      });
    });

    // post update (signed in - member)
    describe("POST /topics/:topicId/posts/:id/update", () => {
      it("should update the post if the member is the same one that created post", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Obi-Wan",
            body: "These blast points...too accurate for sand people"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findById(this.post.id).then(post => {
            expect(post.title).toBe("Obi-Wan");
            expect(post.body).toBe(
              "These blast points...too accurate for sand people"
            );
            done();
          });
        });
      });
    });

    // post destroy (signed in - member)
    describe("POST /topics/:topicId/posts/:id/destroy - member", () => {
      it("should delete the post if the member is the same one that created the post", done => {
        request.post(
          `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
          (err, res, body) => {
            Post.findById(this.post.id).then(post => {
              expect(post).toBeNull();
              done();
            });
          }
        );
      });
    });
  });

  // incorrect user context (signed in but not admin)
  describe("CRUD operations performed by a member user that should not have access to other users' posts", () => {
    beforeEach(done => {
      request.get(
        {
          url: "http://localhost:3000/auth/fake",
          form: {
            id: 7,
            email: "andy@fake.net",
            role: "member"
          }
        },
        (err, res, body) => {
          done();
        }
      );
    });

    // get edit - wrong user
    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should not render the edit view for the wrong user", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Delete");
            expect(body).toContain("Edit");
            expect(body).toContain("New Post Title");
            done();
          }
        );
      });
    });

    // post update - wrong user
    describe("POST /topics/:topicId/posts/:id/update", () => {
      it("should not update the post for the wrong user", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Obi-Wan",
            body:
              "The sand people are easily startled, but they will soon be back, and in greater numbers"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findById(this.post.id).then(post => {
            expect(post.title).toBe("New Post Title");
            done();
          });
        });
      });
    });

    // post destroy - wrong user
    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not delete the post for the wrong user", done => {
        request.post(
          `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
          (err, res, body) => {
            Post.findById(this.post.id).then(post => {
              expect(post).not.toBeNull();
              done();
            });
          }
        );
      });
    });
  });

  // admin context (signed in as admin)
  describe("CRUD operations performed as admin user", () => {
    beforeEach(done => {
      User.create({
        email: 'palpatine@deathstar.net',
        password: '123456'
      })
      .then(user => {
        request.get({
          url: 'http://localhost:3000/auth/fake',
          form: {
            id: user.id,
            email: user.email,
            role: 'admin'
          }
        }, (err, res, body) => {
          done();
        })
      })
    });

    // get new - admin
    describe("GET /topics/:topicId/posts/new", () => {
      it("should render a new post view for the admin user", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Post");
          expect(body).toContain("Submit");
          done();
        });
      });
    });

    // post create - admin
    describe("POST /topics/:topicId/posts/create", () => {
      it("should create a new post for the admin user", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Obi-Wan",
            body:
              "Mos Eisley spaceport. You will never find a more wretched hive of scum and villainy."
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Post.findOne({ where: { title: 'Obi-Wan'} })
          .then(post => {
            expect(post.title).toBe('Obi-Wan');
            expect(post.body).toBe('Mos Eisley spaceport. You will never find a more wretched hive of scum and villainy.');
            done();
          })
        });
      });
    });

    // get edit - admin
    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should render the edit view for the topic selected by the admin user", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain('Edit Post');
            done();
          }
        );
      });
    });

    // post update - admin
    describe('POST /topics/:topicId/posts/:id/update', () => {
      it('should update the post for the topic selected by the admin user', done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: 'Luke Skywalker',
            body: 'Use the force Luke'
          }
        };

        request.post(options, (err, res, body) => {
          Post.findById(this.post.id)
          .then(post => {
            expect(post.title).toBe('Luke Skywalker');
            expect(post.body).toBe('Use the force Luke');
            done();
          });
        });
      });
    });

    // post destroy - admin
    describe('POST /topics/:topicId/posts/:id/destroy', () => {
      it('should delete the post for the topic selected by the admin user', done => {
        request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {
          expect(err).toBeNull();
          Post.findById(this.topic.id)
          .then(post => {
            expect(post).toBeNull();
            done();
          })
        })
      })
    })
  });
});
