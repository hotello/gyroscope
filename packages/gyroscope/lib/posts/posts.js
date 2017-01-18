import { CollectionFast } from 'meteor/hotello:collection-fast';

import { ID_FIELD_OPT } from '../core/collections-helpers.js';
import { Categories } from '../categories/categories.js';

// create collection
export const Posts = new CollectionFast('posts', {
  schema: {
    title: {type: String, max: 500},
    body: {type: String, max: 3000},
    userId: ID_FIELD_OPT,
    categories: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true},
    commentCount: {type: Number}
  },
  pickForMethods: ['title', 'body', 'categories', 'categories.$']
});

// posts helpers
Posts.helpers({
  // get all post's categories objects
  getCategories() {
    return Categories.find({_id: {$in: this.categories}});
  }
});
