import { permit } from '../core/settings.js';
import { Comments } from './comments.js';

Comments.hooks.add('comments.methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'comments.insert', doc)) {
    throw new Meteor.Error('comments.insert.unauthorized');
  }
  // set userId for comment
  doc.userId = context.userId;
  // return the comment
  return doc;
});

Comments.hooks.add('comments.methods.update', function({ context, params }) {
  if (permit.notToDo(context.userId, 'comments.update', params)) {
    throw new Meteor.Error('comments.update.unauthorized');
  }
  // return the params
  return params;
});

Comments.hooks.add('comments.methods.remove', function({ context, params }) {
  if (permit.notToDo(context.userId, 'comments.remove', params)) {
    throw new Meteor.Error('comments.remove.unauthorized');
  }
  // return commentId
  return params;
});
