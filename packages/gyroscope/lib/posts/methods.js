import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit, general } from '../core/settings.js';
import { Posts } from './posts.js';
import { ID_FIELD, ID_FIELD_OPT } from '../core/collections-helpers.js';

// dynamically generate the methods schema
export const generatePostsMethodsSchema = function() {
  return Posts.simpleSchema().pick(general.get('posts.methods.schema'));
};
// accept only ids
export const POSTS_ID_ONLY = new SimpleSchema({
  postId: ID_FIELD
});

export const insert = new ValidatedMethod({
  name: 'posts.insert',
  validate(post) {
    generatePostsMethodsSchema().validate(post)
  },
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
    generatePostsMethodsSchema().validate(modifier, {modifier: true});
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
