import { permit } from '../core/settings.js';
import { Posts } from './posts.js';

Posts.hooks.add('methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'posts.insert', doc)) {
    throw new Meteor.Error('posts.insert.unauthorized');
  }
  // set userId for post
  doc.userId = context.userId;
  return { context, doc };
});

Posts.hooks.add('methods.update', function({ context, _id, modifier }) {
  if (permit.notToDo(context.userId, 'posts.update', { _id, modifier })) {
    throw new Meteor.Error('posts.update.unauthorized');
  }
  return { context, _id, modifier };
});

Posts.hooks.add('methods.remove', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'posts.remove', { _id })) {
    throw new Meteor.Error('posts.remove.unauthorized');
  }
  return { context, _id };
});
