import { permit } from '../core/settings.js';
import { Categories } from './categories.js';

Categories.hooks.add('categories.methods.insert', function({ context, doc }) {
  if (permit.notToDo(context.userId, 'categories.insert')) {
    throw new Meteor.Error('categories.insert.unauthorized');
  }
  // set userId for categorie
  doc.userId = context.userId;
  // return the categorie
  return doc;
});

Categories.hooks.add('categories.methods.update', function({ context, params }) {
  if (permit.notToDo(context.userId, 'categories.update')) {
    throw new Meteor.Error('categories.update.unauthorized');
  }
  // return the params
  return params;
});

Categories.hooks.add('categories.methods.remove', function({ context, params }) {
  if (permit.notToDo(context.userId, 'categories.remove')) {
    throw new Meteor.Error('categories.remove.unauthorized');
  }
  // return categorieId
  return params;
});
