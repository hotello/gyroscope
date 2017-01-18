import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { permit, queries } from '../lib/core/settings.js';
import { Posts } from '../lib/posts/posts.js';
import { Categories } from '../lib/categories/categories.js';
import { Comments } from '../lib/comments/comments.js';

describe('posts', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Posts.remove({});
        Categories.remove({});
        Comments.remove({});
      });

      it('should insert post with denormalizers', function() {
        const post = Factory.create('post');
        assert.isObject(Posts.findOne(post._id));
      });

      it('should update posts with denormalizers', function() {
        const post = Factory.create('post');
        const updateResult = Posts.update(post._id, {$set: Factory.tree('post')});
        assert.equal(updateResult, 1);
      });

      it('should delete posts with denormalizers', function() {
        const post = Factory.create('post');
        const comment = Factory.create('comment', {postId: post._id});
        // check update
        const result = Posts.remove(post._id);
        assert.equal(result, 1);
        // check for comment counter decrement
        assert.isUndefined(Comments.findOne({postId: post._id}));
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
    const methods = Posts.methods;
    const userId = Random.id();
    let methodInvocation = { userId };

    beforeEach(function() {
      if (Meteor.isServer) {
        Posts.remove({});
      }
    });

    it('should insert posts', function() {
      const post = Factory.tree('post.fromForm');
      const result = methods.insert._execute(methodInvocation, post);

      assert.isString(result);
    });

    it('should update posts', function() {
      const postId = Factory.create('post')._id;
      const post = Factory.tree('post.fromForm');
      const result = methods.update._execute(methodInvocation, {_id: postId, modifier: {$set: post}});

      assert.equal(result, 1);
    });

    it('should remove posts', function() {
      const docId = Factory.create('post')._id;
      const result = methods.remove._execute(methodInvocation, docId);

      assert.equal(result, 1);
    });
  });
});
