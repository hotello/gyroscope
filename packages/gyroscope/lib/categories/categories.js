import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { FlexibleCollection } from '../core/flexible-collection.js';

// create collection
export const Categories = new FlexibleCollection('categories');

// deny everything
Categories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Categories.schema = new SimpleSchema({
  name: {type: String, max: 100}
});
// attach schema
Categories.attachSchema(Categories.schema);
