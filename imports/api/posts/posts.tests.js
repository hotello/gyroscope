import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';

import { Posts } from './posts.js';

describe('posts.collection', function() {
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
