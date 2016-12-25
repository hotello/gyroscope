import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { permit, queries } from '../lib/core/settings.js';
import { Posts } from '../lib/posts/posts.js';
import {
  insert,
  update,
  remove
} from '../lib/posts/methods.js';
import { Categories } from '../lib/categories/categories.js';

describe('posts', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Posts.remove({});
        Categories.remove({});
      });

      it('should insert post with auto values', function() {
        const post = Factory.create('post');
        assert.isObject(Posts.findOne(post._id));
      });

      it('should alter posts with auto values', function() {
        const post = Factory.create('post');
        const updateResult = Posts.update(post._id, {$set: Factory.tree('post')});
        assert.equal(updateResult, 1);
        // check upsert
        const upsertResult = Posts.upsert(post._id, {$set: Factory.tree('post')});
        assert.equal(upsertResult.numberAffected, 1);
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
    const userId = Random.id();
    let methodInvocation = {userId};

    beforeEach(function() {
      if (Meteor.isServer) {
        Posts.remove({});
      }
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
  });

  describe('publications', function() {
    if (Meteor.isServer) {
      it('should send posts by query', function (done) {
        const collector = new PublicationCollector();
        const postOne = Factory.create('post');
        const postTwo = Factory.create('post');
        // set the query function
        queries.set({'posts.testQuery': function(params) {
          return {selector: params.selector, options: {skip: params.skip}};
        }});
        // collect publication result
        collector.collect('posts.byQuery', 'posts.testQuery', {selector: {}, skip: 1}, (collections) => {
          assert.equal(collections.posts.length, 1);
          done();
        });
      });

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
});
