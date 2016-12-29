import { permit } from '../core/settings.js';
import { Posts } from './posts.js';

Posts.hooks.add('posts.methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'posts.insert', doc)) {
    throw new Meteor.Error('posts.insert.unauthorized');
  }
  // set userId for post
  doc.userId = context.userId;
  return { context, doc };
});

Posts.hooks.add('posts.methods.update', function({ context, params }) {
  if (permit.notToDo(context.userId, 'posts.update', params)) {
    throw new Meteor.Error('posts.update.unauthorized');
  }
  return { context, params };
});

Posts.hooks.add('posts.methods.remove', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'posts.remove', { _id })) {
    throw new Meteor.Error('posts.remove.unauthorized');
  }
  return { context, _id };
});
