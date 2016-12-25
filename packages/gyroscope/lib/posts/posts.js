import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { permit, hooks } from '../core/settings.js';
import { FlexibleCollection } from '../core/flexible-collection.js';
import { ID_FIELD_OPT } from '../core/collections-helpers.js';
import { Categories } from '../categories/categories.js';

// create collection
export const Posts = new FlexibleCollection('posts');

// deny everything
Posts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Posts.schema = new SimpleSchema({
  title: {type: String, max: 500},
  body: {type: String, max: 3000},
  userId: ID_FIELD_OPT,
  categories: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true}
});
// attach schema
Posts.attachSchema(Posts.schema);

// posts helpers
Posts.helpers({
  // get all post's categories objects
  getCategories() {
    return Categories.find({_id: {$in: this.categories}});
  }
});
