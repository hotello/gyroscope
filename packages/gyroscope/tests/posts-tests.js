import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { permit } from '../lib/core/settings.js';
import { Posts, postsIndex } from '../lib/posts/posts.js';
import {
  insert,
  update,
  remove
} from '../lib/posts/methods.js';
import { Categories } from '../lib/categories/categories.js';

Meteor.methods({
  'test.resetPosts': () => Posts.remove({}),
});

describe('posts', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Posts.remove({});
        Categories.remove({});
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

      it('should insert post with existing category', function() {
        const category = Factory.create('category');
        // add subscribers to category
        category.addSubscriber(Random.id());
        const post = Factory.create('post', {categories: [category._id]});
      });

      describe('helpers', function() {
        beforeEach(function() {
          Categories.remove({});
          Posts.remove({});
        });

        it('should get post categories', function() {
          const category = Factory.create('category');
          const post = Factory.create('post', {categories: [category._id]});
          assert.equal(post.getCategories().count(), 1);
        });
      });
    }
  });

  describe('methods', function() {
    if (Meteor.isServer) {
      const userId = Random.id();
      let methodInvocation = {userId};

      beforeEach(function(done) {
        Meteor.call('test.resetPosts', done);
      });

      it('should insert posts', function() {
        const post = Factory.tree('post.fromForm');
        const result = insert._execute(methodInvocation, post);

        assert.isString(result);
      });

      it('should update posts', function() {
        const postId = Factory.create('post')._id;
        const post = Factory.tree('post.fromForm');
        const result = update._execute(methodInvocation, {_id: postId, modifier: {$set: post}});

        assert.equal(result, 1);
      });

      it('should remove posts', function() {
        const postId = Factory.create('post')._id;
        const result = remove._execute(methodInvocation, { postId });

        assert.equal(result, 1);
      });
    }
  });

  describe('publications', function() {
    if (Meteor.isServer) {
      it('should send a single post', function (done) {
        const collector = new PublicationCollector();
        const post = Factory.create('post');

        collector.collect('posts.single', post._id, (collections) => {
          assert.equal(collections.posts.length, 1);
          done();
        });
      });
    }
  });

  describe('search', function() {
    const index = postsIndex;

    beforeEach(function(done) {
      Meteor.call('test.resetPosts', done);
    });

    if (Meteor.isServer) {
      it('should search for posts by text', function() {
        permit.set({
          'posts.search': () => true,
        });

        const post = Factory.create('post');
        const posts = index.search(post.title).fetch();

        assert.equal(posts.length, 1);
      });
    }
  });
});
