"use strict";
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Post.hasMany(models.Flair, {
      foreignKey: "postId",
      as: "flairs"
    });

    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments'
    });

    Post.hasMany(models.Vote, {
      foreignKey: 'postId',
      as: 'votes'
    });

    Post.hasMany(models.Favorite, {
      foreignKey: 'postId',
      as: 'favorites'
    });

    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    })
  };

  Post.prototype.getPoints = function() {
    if(!this.votes || this.votes.length === 0) {
      return 0;
    }

    return this.votes.map(v => v.value).reduce((prev, next) => prev + next);
  }

  Post.prototype.hasUpvoteFor = function(userId) {
    if(!this.votes || this.votes.length === 0) {
      return false;
    }

    return this.votes.filter(vote => vote.userId === userId && vote.value === 1).length > 0;
  }

  Post.prototype.hasDownvoteFor = function(userId) {
    if(!this.votes || this.votes.length === 0) {
      return false;
    }

    return this.votes.filter(vote => vote.userId === userId && vote.value === -1).length > 0;
  }

  Post.prototype.getFavoriteFor = function(userId) {
    return this.favorites.find(fave => fave.userId == userId);
  }

  return Post;
};
