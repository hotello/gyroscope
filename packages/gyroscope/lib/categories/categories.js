import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import { setSlugFromName } from '../core/collections-helpers.js';

// create collection
export const Categories = new Mongo.Collection('categories');

// deny everything
Categories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Categories.schema = new SimpleSchema({
  name: {type: String, max: 100},
  slug: {type: String, unique: true, autoValue: setSlugFromName},
  description: {type: String, max: 500, optional: true},
  image: {type: String, max: 500, regEx: SimpleSchema.RegEx.Url, optional: true}
});
// attach schema
Categories.attachSchema(Categories.schema);

// define factory generators for tests
Factory.define('category', Categories, {
  name: () => faker.lorem.words(),
  description: () => faker.lorem.sentence(),
  image: () => faker.image.imageUrl()
});
