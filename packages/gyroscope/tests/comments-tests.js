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

      it('should insert comment with denormalizers', function() {
        const post = Factory.create('post');
        const comment = Factory.create('comment', {postId: post._id});
        // check for insert
        assert.isObject(Comments.findOne());
        // check if comment counter is incremented
        assert.equal(Posts.findOne(post._id).commentCount, 1);
      });

      it('should update comments with denormalizers', function() {
        const comment = Factory.create('comment');
        // check update
        const updateResult = Comments.update(comment._id, {$set: Factory.tree('comment')});
        assert.equal(updateResult, 1);
      });

      it('should delete comments with denormalizers', function() {
        const post = Factory.create('post');
        const comment = Factory.create('comment', {postId: post._id});
        // check update
        const result = Comments.remove(comment._id);
        assert.equal(result, 1);
        // check for comment counter decrement
        assert.equal(Posts.findOne(post._id).commentCount, 0);
      });

      describe('helpers', function() {
        it('should get comment\'s post', function() {
          const post = Factory.create('post');
          const comment = Factory.create('comment', {postId: post._id});
          assert.equal(comment.post()._id, post._id);
        });
      });
    }
  });

  describe('methods', function() {
    const methods = Comments.methods;
    const userId = Random.id();
    let methodInvocation = {userId};

    beforeEach(function() {
      if (Meteor.isServer) Comments.remove({});
    });

    it('should insert comments', function() {
      const comment = Factory.tree('comment.fromForm');
      const result = methods.insert._execute(methodInvocation, comment);

      assert.isString(result);
    });

    it('should update comments', function() {
      const commentId = Factory.create('comment')._id;
      const comment = Factory.tree('comment.fromForm');
      const result = methods.update._execute(methodInvocation, {_id: commentId, modifier: {$set: comment}});

      assert.equal(result, 1);
    });

    it('should remove comments', function() {
      const docId = Factory.create('comment')._id;
      const result = methods.remove._execute(methodInvocation, docId);

      assert.equal(result, 1);
    });
  });
});
