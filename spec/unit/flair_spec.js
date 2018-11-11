// const sequelize = require("../../src/db/models/index").sequelize;
// const Topic = require("../../src/db/models").Topic;
// const Post = require("../../src/db/models").Post;
// const Flair = require("../../src/db/models").Flair;

// describe("Flair", () => {
//   beforeEach(done => {
//     this.topic;
//     this.post;
//     this.flair;
//     sequelize.sync({
//       force: true
//     }).then(res => {
//       Topic.create({
//         title: "This is a Test Topic",
//         description: "This is a test description"
//       }).then(topic => {
//         this.topic = topic;
//         Post.create({
//           title: "This is a Test Post",
//           body: "This is a test post's body",
//           topicId: this.topic.id
//         }).then(post => {
//           this.post = post;
//           Flair.create({
//               name: "This is a Test Flair",
//               color: "Blue",
//               postId: this.post.id
//             })
//             .then(flair => {
//               this.flair = flair;
//               done();
//             })
//             .catch(err => {
//               console.log(err);
//               done();
//             });
//         });
//       });
//     });
//   });

//   describe("#create()", () => {
//     it("should create a flair object with a name, color, and assigned post", done => {
//       Flair.create({
//           name: "Funny",
//           color: "Orange",
//           postId: this.post.id
//         })
//         .then(flair => {
//           expect(flair.name).toBe("Funny");
//           expect(flair.color).toBe("Orange");
//           expect(flair.postId).toBe(this.post.id);
//           done();
//         })
//         .catch(err => {
//           console.log(err);
//           done();
//         });
//     });

//     it("should not create a flair with a missing name, color, or postId", done => {
//       Flair.create({
//           name: "Sad"
//         })
//         .then(flair => {
//           done();
//         })
//         .catch(err => {
//           expect(err.message).toContain("Flair.color cannot be null");
//           expect(err.message).toContain("Flair.postId cannot be null");
//           done();
//         });
//     });
//   });

//   describe("#setPost()", () => {
//     it("should associate a post and a flair together", done => {
//       Post.create({
//         title: "Test Post 2",
//         body: "Body of test post 2",
//         topicId: this.topic.id
//       }).then(newPost => {
//         expect(this.flair.postId).toBe(this.post.id);
//         this.flair.setPost(newPost).then(flair => {
//           expect(flair.postId).toBe(newPost.id);
//           done();
//         });
//       });
//     });
//   });

//   describe("#getPost()", () => {
//     it("should return the associated post", done => {
//       this.flair.getPost()
//         .then(associatedPost => {
//           expect(associatedPost.title).toBe("This is a Test Post");
//           done();
//         }).catch(err => {
//           console.log(err);
//           done();
//         });
//     });
//   });
// });