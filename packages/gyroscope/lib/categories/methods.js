import { permit } from '../core/settings.js';
import { Categories } from './categories.js';

Categories.hooks.add('categories.methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'categories.insert', doc)) {
    throw new Meteor.Error('categories.insert.unauthorized');
  }
  // set userId for categorie
  doc.userId = context.userId;
  return { context, doc };
});

Categories.hooks.add('categories.methods.update', function({ context, params }) {
  if (permit.notToDo(context.userId, 'categories.update', params)) {
    throw new Meteor.Error('categories.update.unauthorized');
  }
  return { context, params };
});

Categories.hooks.add('categories.methods.remove', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'categories.remove', { _id })) {
    throw new Meteor.Error('categories.remove.unauthorized');
  }
  return { context, _id };
});
