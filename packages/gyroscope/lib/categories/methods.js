import { permit } from '../core/settings.js';
import { Categories } from './categories.js';

Categories.hooks.add('methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'categories.insert', doc)) {
    throw new Meteor.Error('categories.insert.unauthorized');
  }
  // set userId for categorie
  doc.userId = context.userId;
  return { context, doc };
});

Categories.hooks.add('methods.update', function({ context, _id, modifier }) {
  if (permit.notToDo(context.userId, 'categories.update', { _id, modifier })) {
    throw new Meteor.Error('categories.update.unauthorized');
  }
  return { context, _id, modifier };
});

Categories.hooks.add('methods.remove', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'categories.remove', { _id })) {
    throw new Meteor.Error('categories.remove.unauthorized');
  }
  return { context, _id };
});
