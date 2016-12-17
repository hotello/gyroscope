import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit } from '../core/gyroscope.js';
import { Posts } from './posts.js';
import { ID_FIELD, ID_FIELD_OPT } from '../core/collections-helpers.js';

// common validator for methods
export const POSTS_METHODS_SCHEMA = new SimpleSchema({
  title: Posts.simpleSchema().schema('title'),
  body: Posts.simpleSchema().schema('body'),
  categories: ID_FIELD_OPT
});
// accept only ids
export const POSTS_ID_ONLY = new SimpleSchema({
  postId: ID_FIELD
});

export const insert = new ValidatedMethod({
  name: 'posts.insert',
  validate: POSTS_METHODS_SCHEMA.validator(),
  run(post) {
    if (permit.notToDo(this.userId, 'posts.insert')) {
      throw new Meteor.Error('posts.insert.unauthorized');
    }
    // set userId for post
    post.userId = this.userId;

    return Posts.insert(post);
  }
});

export const update = new ValidatedMethod({
  name: 'posts.update',
  validate({ _id, modifier }) {
    POSTS_ID_ONLY.validate({postId: _id});
    POSTS_METHODS_SCHEMA.validate(modifier, {modifier: true});
  },
  run({ _id, modifier }) {
    if (permit.notToDo(this.userId, 'posts.update')) {
      throw new Meteor.Error('posts.update.unauthorized');
    }

    return Posts.update(_id, modifier);
  }
});

export const remove = new ValidatedMethod({
  name: 'posts.remove',
  validate: POSTS_ID_ONLY.validator(),
  run({ postId }) {
    if (permit.notToDo(this.userId, 'posts.remove')) {
      throw new Meteor.Error('posts.remove.unauthorized');
    }

    return Posts.remove(postId);
  }
});
