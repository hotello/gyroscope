import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';

import { Gyroscope } from '../lib/core/gyroscope.js';
import { Posts } from '../lib/posts/posts.js';

import { gyroscope } from './tests-helpers.js';

Meteor.methods({
  'test.resetPosts': () => Posts.remove({}),
});

describe('posts', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Posts.remove({});
      });

      it('should insert post with auto values', function() {
        const post = Factory.create('post');

        assert.isObject(Posts.findOne());
        // posts must have a slug
        assert.isString(post.slug);
        // posts must have a createdAt
        assert.typeOf(post.createdAt, 'date');
      });

      it('should alter posts with auto values', function() {
        const post = Factory.create('post');

        // check update
        Posts.update(post._id, {$set: Factory.tree('post')});
        assert.equal(post.createdAt.getTime(), Posts.findOne(post._id).createdAt.getTime());
        assert.notEqual(post.slug, Posts.findOne(post._id).slug);
        // check upsert WARNING: we have a bug in aldeed:collection2-core, we can't upsert
        // Posts.upsert(post._id, {$set: Factory.tree('post')});
        // assert.equal(post.createdAt.getTime(), Posts.findOne(post._id).createdAt.getTime());
        // assert.notEqual(post.slug, Posts.findOne(post._id).slug);
      });
    }
  });

  describe('methods', function() {
    const userId = Random.id();
    const methods = gyroscope._methods.posts;

    let methodInvocation = {userId};

    beforeEach(function(done) {
      Meteor.call('test.resetPosts', done);
    });

    it('should insert posts', function() {
      const post = Factory.tree('post.fromForm');
      const result = methods.insert._execute(methodInvocation, post);

      assert.isString(result);
    });

    it('should update posts', function() {
      const postId = Factory.create('post')._id;
      const post = Factory.tree('post.fromForm');
      const result = methods.update._execute(methodInvocation, { postId, post});

      assert.equal(result, 1);
    });

    it('should remove posts', function() {
      const postId = Factory.create('post')._id;
      const result = methods.remove._execute(methodInvocation, { postId });

      assert.equal(result, 1);
    });
  });

  describe('search', function() {
    const index = gyroscope._indexes.posts;

    beforeEach(function(done) {
      Meteor.call('test.resetPosts', done);
    });

    it('should search for posts by text', function() {
      const post = Factory.create('post');
      const posts = index.search(post.title).fetch();

      assert.equal(posts.length, 1);
    });
  });
});
