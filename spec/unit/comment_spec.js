const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;
const Comment = require('../../src/db/models').Comment;

describe('Comment', () => {
  beforeEach(done => {
    this.user;
    this.topic;
    this.post;
    this.comment;

    sequelize.sync({ force: true })
    .then(res => {
      User.create({
        email: 'vader@empire.net',
        password: 'forcechokin'
      })
      .then(user => {
        this.user = user;

        Topic.create({
          title: 'How to Crush the Rebellion',
          description: 'Tips and tricks for Sith Lords',
          posts: [{
            title: 'Lots of Rebels on Hoth',
            body: 'One of our probes found their base.',
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: 'posts'
          }
        })
        .then(topic => {
          this.topic = topic;
          this.post = this.topic.posts[0];

          Comment.create({
            body: 'Great work team!',
            userId: this.user.id,
            postId: this.post.id
          })
          .then(comment => {
            this.comment = comment;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
        });
      });
    });
  });

  describe('#create()', () => {
    it('should create a comment object with a body, assigned post, and user', done => {
      Comment.create({
        body: 'Send in the AT-ATs',
        postId: this.post.id,
        userId: this.user.id
      })
      .then(comment => {
        expect(comment.body).toBe('Send in the AT-ATs');
        expect(comment.postId).toBe(this.post.id);
        expect(comment.userId).toBe(this.user.id);
        done();
      })
      .catch(err => {
        console.log(err);
        done();
      });
    });

    it('should not create a comment with a missing body, assigned post, or user', done => {
      Comment.create({
        body: 'I love the rebellion'
      })
      .then(comment => {
        done();
      })
      .catch(err => {
        expect(err.message).toContain('Comment.userId cannot be null');
        expect(err.message).toContain('Comment.postId cannot be null');
        done();
      })
    });
  });

  describe('#setUser()', () => {
    it('should associate a comment and a user together', done => {
      User.create({
        email: 'bobafett@slave1.edu',
        password: 'carbonite'
      })
      .then(user => {
        expect(this.comment.userId).toBe(this.user.id);
        this.comment.setUser(user)
        .then(comment => {
          expect(comment.userId).toBe(user.id);
          done();
        });
      });
    });
  });

  describe('#setPost()', () => {
    it('should associate a post and a comment together', done => {
      Post.create({
        title: 'Wanted: Bounty Hunters',
        body: 'Need some help hunting down Han Solo',
        topicId: this.topic.id,
        userId: this.user.id
      })
      .then(post => {
        expect(this.comment.postId).toBe(this.post.id);

        this.comment.setPost(post)
        .then(comment => {
          expect(comment.postId).toBe(post.id);
          done();
        });
      });
    });
  });

  describe('#getPost()', () => {
    it('should return the associated post', done => {
      this.comment.getPost()
      .then(post => {
        expect(post.title).toBe('Lots of Rebels on Hoth');
        done();
      });
    });
  });
});