import { permit } from '../core/settings.js';
import { Comments } from './comments.js';

Comments.hooks.add('methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'comments.insert', doc)) {
    throw new Meteor.Error('comments.insert.unauthorized');
  }
  // set userId for comment
  doc.userId = context.userId;
  return { context, doc };
});

Comments.hooks.add('methods.update', function({ context, _id, modifier }) {
  if (permit.notToDo(context.userId, 'comments.update', { _id, modifier })) {
    throw new Meteor.Error('comments.update.unauthorized');
  }
  return { context, _id, modifier };
});

Comments.hooks.add('methods.remove', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'comments.remove', { _id })) {
    throw new Meteor.Error('comments.remove.unauthorized');
  }
  return { context, _id };
});
