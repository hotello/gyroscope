import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Gyroscope } from '../core/gyroscope.js';
import { Posts } from './posts.js';
import { ID_FIELD } from '../core/collections-helpers.js';

// common validator for methods
export const POSTS_METHODS_SCHEMA = new SimpleSchema({
  title: Posts.simpleSchema().schema('title'),
  body: Posts.simpleSchema().schema('body')
});
// accept only ids
export const POSTS_ID_ONLY = new SimpleSchema({
  postId: ID_FIELD
}).validator();

export const insert = new ValidatedMethod({
  name: 'posts.insert',
  validate: POSTS_METHODS_SCHEMA.validator(),
  run(post) {
    if (Gyroscope.permit.notToDo(this.userId, 'posts.insert')) {
      throw new Meteor.Error('posts.insert.unauthorized');
    }
    // set userId for post
    post.userId = this.userId;

    return Posts.insert(post);
  }
});

export const update = new ValidatedMethod({
  name: 'posts.update',
  validate: new SimpleSchema({
    postId: ID_FIELD,
    post: {type: POSTS_METHODS_SCHEMA}
  }).validator(),
  run({ postId, post }) {
    if (Gyroscope.permit.notToDo(this.userId, 'posts.update')) {
      throw new Meteor.Error('posts.update.unauthorized');
    }

    return Posts.update(postId, {$set: post});
  }
});

export const remove = new ValidatedMethod({
  name: 'posts.remove',
  validate: POSTS_ID_ONLY,
  run({ postId }) {
    if (Gyroscope.permit.notToDo(this.userId, 'posts.delete')) {
      throw new Meteor.Error('posts.remove.unauthorized');
    }

    return Posts.remove(postId);
  }
});
