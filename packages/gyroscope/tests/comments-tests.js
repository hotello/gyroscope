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
        // comments must have a createdAt
        assert.typeOf(comment.createdAt, 'date');
      });

      it('should alter comments with auto values', function() {
        const comment = Factory.create('comment');
        // check update
        Comments.update(comment._id, {$set: Factory.tree('comment')});
        assert.equal(comment.createdAt.getTime(), Comments.findOne(comment._id).createdAt.getTime());
        // check upsert
        // Comments.upsert(comment._id, {$set: Factory.tree('comment')});
        // assert.equal(comment.createdAt.getTime(), Comments.findOne(comment._id).createdAt.getTime());
        // assert.notEqual(comment.slug, Comments.findOne(comment._id).slug);
      });

      it('should insert comment with existing category', function() {
        const category = Factory.create('category');
        // add subscribers to category
        category.addSubscriber(Random.id());
        const comment = Factory.create('comment', {categories: [category._id]});
      });

      describe('helpers', function() {
        beforeEach(function() {
          Posts.remove({});
          Comments.remove({});
        });
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
        Posts.remove({});
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

        collector.collect('comments.byPost', post._id, (collections) => {
          assert.equal(collections.comments.length, 1);
          done();
        });
      });
    }
  });
});
