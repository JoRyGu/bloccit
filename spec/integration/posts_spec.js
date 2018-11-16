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

    sequelize.sync({ force: true }).then(res => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(user => {
        this.user = user;

        Topic.create(
          {
            title: "Winter Games",
            description: "Post your Winter Games stories.",
            posts: [
              {
                title: "Snowball Fighting",
                body: "So much snow!",
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Post,
              as: "posts"
            }
          }
        ).then(topic => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
      });
    });
  });

  describe("guest user performing CRUD actions on a post", () => {
    beforeEach(done => {
      request.get({
        url: "http://localhost3000/auth/fake",
        form: {
          userId: this.user.id,
          role: "guest"
        }
      });
      done();
    });
    describe("GET /topics/:topicId/posts/:id", () => {
      it("should display the post view for the post the guest is trying to access", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Snowball Fighting");
            done();
          }
        );
      });
    });

    describe("GET /topics/:topicId/posts/new", () => {
      it("should redirect a guest user to the sign in view", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Email");
          expect(body).toContain("Password");
          done();
        });
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should not create a new topic", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Watching snow melt",
            body: "It is the best activity."
          }
        };
        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "Watching snow melt" } })
            .then(post => {
              expect(post).toBeNull();
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    describe("GET /topics/:topicId/posts/:id/edit", () => {
      it("should redirect the guest user to the sign in page", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
          (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Email");
            expect(body).toContain("Password");
            done();
          }
        );
      });
    });

    describe("POST /topics/:topicId/posts/:id/update", () => {
      it("should not update the selected post", done => {
        const options = {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Summer Games"
          }
        };

        request.post(options, (err, res, body) => {
          Post.findOne({ where: { id: this.post.id } }).then(post => {
            expect(post.title).toBe("Snowball Fighting");
            done();
          });
        });
      });
    });

    describe("POST /topics/:topicId/posts/:id/destroy", () => {
      it("should not destroy the post", done => {
        expect(this.topic.posts.length).toBe(1);
        request.post(
          `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
          (err, res, body) => {
            Post.findOne({ where: { id: this.post.id } }).then(post => {
              expect(post).not.toBeNull();
              done();
            });
          }
        );
      });
    });
  });

  describe("Regular member performing CRUD operations on posts", () => {
    beforeEach(done => {
      this.member;
      this.newPost;
      User.create({
        email: "josh@fake.net",
        password: "123456"
      }).then(user => {
        this.member = user;
        request.get(
          {
            url: "http://localhost:3000/auth/fake",
            form: {
              id: this.member.id,
              email: this.member.email,
              role: "member"
            }
          },
          (err, res, body) => {
            Post.create({
              title: "This is a new post.",
              body: "This is the body of a new post.",
              topicId: this.topic.id,
              userId: this.member.id
            }).then(post => {
              this.newPost = post;
              done();
            });
          }
        );
      });
    });

    describe("GET /topics/:topidId/posts/:id", () => {
      it("should display the post for a member user", done => {
        request.get(
          `${base}/${this.topic.id}/posts/${this.post.id}`,
          (err, res, body) => {
            expect(body).toContain("Snowball Fighting");
            expect(body).toContain("So much snow!");
            done();
          }
        );
      });
    });

    describe("GET /topics/:topicId/posts/new", () => {
      it("should display the new topic view for the user", done => {
        request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
          expect(body).toContain("New Post");
          expect(body).toContain(
            "Title must be 2 or more characters in length"
          );
          done();
        });
      });
    });

    describe("POST /topics/:topicId/posts/create", () => {
      it("should create a new post and redirect", done => {
        let options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "I'm a Brand New Post",
            body: "I'm probably the best test post ever."
          }
        };
        request.post(options, (err, res, body) => {
          Post.findOne({ where: { title: "I'm a Brand New Post" } })
            .then(post => {
              expect(post).not.toBeNull();
              expect(post.title).toBe("I'm a Brand New Post");
              expect(post.body).toBe("I'm probably the best test post ever.");
              done();
            })
            .catch(err => {
              console.log(err);
              done();
            });
        });
      });
    });

    // describe("GET /topics/:topicId/posts/:id/edit", () => {
    //   it("should render the edit post view for the member", done => {
    //     request.get(
    //       `${base}/${this.topic.id}/posts/${this.newPost.id}/edit`,
    //       (err, res, body) => {
    //         expect(err).toBeNull();
    //         expect(body).toContain("Edit Post");
    //         done();
    //       }
    //     );
    //   });
    // });
  });

  // describe("GET /topics/:topicId/posts/new", () => {
  //   it("should render a new post form", done => {
  //     request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
  //       expect(err).toBeNull();
  //       expect(body).toContain("New Post");
  //       done();
  //     });
  //   });
  // });

  // describe("POST /topics/:topicId/posts/create", () => {
  //   it("should create a new post and redirect", done => {
  //     const options = {
  //       url: `${base}/${this.topic.id}/posts/create`,
  //       form: {
  //         title: "Watching snow melt",
  //         body:
  //           "Without a doubt my favorite things to do besides watching paint dry!"
  //       }
  //     };
  //     request.post(options, (req, res, body) => {
  //       Post.findOne({ where: { title: "Watching snow melt" } })
  //         .then(post => {
  //           expect(post).not.toBeNull();
  //           expect(post.title).toBe("Watching snow melt");
  //           expect(post.body).toBe(
  //             "Without a doubt my favorite things to do besides watching paint dry!"
  //           );
  //           done();
  //         })
  //         .catch(err => {
  //           console.log(err);
  //           done();
  //         });
  //     });
  //   });

  //   it("should not create a new post that fails validations", done => {
  //     const options = {
  //       url: `${base}/${this.topic.id}/posts/create`,
  //       form: {
  //         title: "a",
  //         body: "b"
  //       }
  //     };
  //     request.post(options, (err, res, body) => {
  //       Post.findOne({where: {title: "a"}}).then(post => {
  //         expect(post).toBeNull();
  //         done();
  //       }).catch(err => {
  //         console.log(err);
  //         done();
  //       });
  //     });
  //   });
  // });

  // describe("GET /topics/:topicId/posts/:id", () => {
  //   it("should render a view with the selected post", done => {
  //     request.get(
  //       `${base}/${this.topic.id}/posts/${this.post.id}`,
  //       (err, res, body) => {
  //         expect(err).toBeNull();
  //         expect(body).toContain("Snowball Fighting");
  //         done();
  //       }
  //     );
  //   });
  // });

  // describe("POST /topics/:topicId/posts/:id/destroy", () => {
  //   it("should delete the post with the associated id", done => {
  //     expect(this.post.id).toBe(1);
  //     request.post(
  //       `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
  //       (err, res, body) => {
  //         Post.findById(1).then(post => {
  //           expect(err).toBeNull();
  //           expect(post).toBeNull();
  //           done();
  //         });
  //       }
  //     );
  //   });
  // });

  // describe("GET /topics/:topicId/posts/:id/edit", () => {
  //   it("should render a view with an edit post form", done => {
  //     request.get(
  //       `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
  //       (err, res, body) => {
  //         expect(err).toBeNull();
  //         expect(body).toContain("Edit Post");
  //         expect(body).toContain("Snowball Fighting");
  //         done();
  //       }
  //     );
  //   });
  // });

  // describe("POST /topics/:topicId/posts/:id/update", () => {
  //   it("should return a status code 302", done => {
  //     request.post(
  //       {
  //         url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
  //         form: {
  //           title: "Snowman Building Competition",
  //           body: "I love watching them melt slowly."
  //         }
  //       },
  //       (err, res, body) => {
  //         expect(res.statusCode).toBe(302);
  //         done();
  //       }
  //     );
  //   });

  //   it("should update the post with the given value", done => {
  //     const options = {
  //       url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
  //       form: {
  //         title: "Snowman Building Competition",
  //         body: "This is a new body"
  //       }
  //     };
  //     request.post(options, (err, res, body) => {
  //       expect(err).toBeNull();
  //       Post.findOne({ where: { id: this.post.id } }).then(post => {
  //         expect(post.title).toBe("Snowman Building Competition");
  //         done();
  //       });
  //     });
  //   });
  // });
});
