import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Posts } from './posts.js';
import {
  insert,
  update,
  remove
} from './methods.js';

describe('posts.methods', function() {
  let userId = Random.id();
  let methodInvocation;

  if (Meteor.isServer) {
    methodInvocation = {userId};


    beforeEach(function() {
      Posts.remove({});
    });

    it('should insert posts', function() {
      const post = Factory.tree('post.fromForm');
      const result = insert._execute(methodInvocation, post);

      assert.isString(result);
    });

    it('should update posts', function() {
      const postId = Factory.create('post')._id;
      const post = Factory.tree('post.fromForm');
      const result = update._execute(methodInvocation, { postId, post});

      assert.equal(result, 1);
    });

    it('should remove posts', function() {
      const postId = Factory.create('post')._id;
      const result = remove._execute(methodInvocation, { postId });

      assert.equal(result, 1);
    });
  }
});
