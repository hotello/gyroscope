import { permit } from '../core/settings.js';
import { Posts } from './posts.js';

Posts.hooks.add('posts.methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'posts.insert')) {
    throw new Meteor.Error('posts.insert.unauthorized');
  }
  // set userId for post
  doc.userId = context.userId;
  // return the post
  return doc;
});

Posts.hooks.add('posts.methods.update', function({ context, params }) {
  if (permit.notToDo(context.userId, 'posts.update')) {
    throw new Meteor.Error('posts.update.unauthorized');
  }
  // return the params
  return params;
});

Posts.hooks.add('posts.methods.remove', function({ context, params }) {
  if (permit.notToDo(context.userId, 'posts.remove')) {
    throw new Meteor.Error('posts.remove.unauthorized');
  }
  // return postId
  return params;
});
