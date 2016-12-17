import { Meteor } from 'meteor/meteor';

import { permit } from '../../core/gyroscope.js';
import { ID_FIELD } from '../../core/collections-helpers.js';
import { Categories } from '../categories.js';

Meteor.publish('categories.all', function() {
  if (permit.notToDo(this.userId, 'categories.publish.all')) {
    return this.ready();
  }

  return Categories.find();
});

Meteor.publish('categories.single', function(categoryId) {
  console.log(categoryId);

  new SimpleSchema({
    categoryId: ID_FIELD
  }).validate({ categoryId });

  if (permit.notToDo(this.userId, 'categories.publish.single', {categoryId})) {
    return this.ready();
  }

  return Categories.find(categoryId);
});
