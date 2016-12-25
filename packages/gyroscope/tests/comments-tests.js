import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { permit } from '../lib/core/settings.js';
import { Comments, commentsIndex } from '../lib/comments/comments.js';
import {
  insert,
  update,
  remove
} from '../lib/comments/methods.js';
import { Posts } from '../lib/posts/posts.js';

describe('comments', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Comments.remove({});
        Posts.remove({});
      });

      it('should insert comment with auto values', function() {
        const comment = Factory.create('comment');
        // check for insert
        assert.isObject(Comments.findOne());
      });

      it('should alter comments with auto values', function() {
        const comment = Factory.create('comment');
        // check update
        const updateResult = Comments.update(comment._id, {$set: Factory.tree('comment')});
        assert.equal(updateResult, 1);
      });
    }
  });

  describe('methods', function() {
    const userId = Random.id();
    let methodInvocation = {userId};

    beforeEach(function() {
      if (Meteor.isServer) Comments.remove({});
    });

    it('should insert comments', function() {
      const comment = Factory.tree('comment.fromForm');
      const result = insert._execute(methodInvocation, comment);

      assert.isString(result);
    });

    it('should update comments', function() {
      const commentId = Factory.create('comment')._id;
      const comment = Factory.tree('comment.fromForm');
      const result = update._execute(methodInvocation, {_id: commentId, modifier: {$set: comment}});

      assert.equal(result, 1);
    });

    it('should remove comments', function() {
      const commentId = Factory.create('comment')._id;
      const result = remove._execute(methodInvocation, { commentId });

      assert.equal(result, 1);
    });
  });

  describe('publications', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Comments.remove({});
      });

      it('should send a single comment', function (done) {
        const collector = new PublicationCollector();
        const comment = Factory.create('comment');

        collector.collect('comments.single', comment._id, (collections) => {
          assert.equal(collections.comments.length, 1);
          done();
        });
      });

      it('should send comments by post', function (done) {
        const collector = new PublicationCollector();
        const post = Factory.create('post');
        const comment = Factory.create('comment', {postId: post._id});
        const commentTwo = Factory.create('comment', {postId: post._id});
        const queryName = 'comments.byPost';
        const queryParams = {postId: post._id, limit: 1};

        collector.collect('comments.byQuery', queryName, queryParams, (collections) => {
          assert.equal(collections.comments.length, 1);
          done();
        });
      });
    }
  });
});
