import { Meteor } from 'meteor/meteor';

import { permit } from '../../core/settings.js';
import { ID_FIELD } from '../../core/collections-helpers.js';
import { Categories } from '../categories.js';
import { generatePublishByQuery } from '../../core/server/generatePublishByQuery.js';

Meteor.publish('categories.byQuery', generatePublishByQuery({
  collection: Categories,
  permissionName: 'categories.publish.byQuery'
}));

Meteor.publish('categories.single', function(categoryId) {
  new SimpleSchema({
    categoryId: ID_FIELD
  }).validate({ categoryId });

  if (permit.notToDo(this.userId, 'categories.publish.single', {categoryId})) {
    return this.ready();
  }

  return Categories.find(categoryId);
});
