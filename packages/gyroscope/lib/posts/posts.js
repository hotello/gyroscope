import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Index, MongoDBEngine } from 'meteor/easy:search'
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import faker from 'faker';

import { permit } from '../core/gyroscope.js';
import {
  ID_FIELD_OPT,
  setCreatedAt,
  setSlugFromTitle,
  categoriesToArray
} from '../core/collections-helpers.js';

// create collection
export const Posts = new Mongo.Collection('posts');

// deny everything
Posts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Posts.schema = new SimpleSchema({
  createdAt: {type: Date, autoValue: setCreatedAt},
  title: {type: String, max: 500},
  slug: {type: String, unique: true, autoValue: setSlugFromTitle},
  body: {type: String, max: 3000},
  userId: ID_FIELD_OPT,
  categories: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true, autoValue: categoriesToArray}
});
// attach schema
Posts.attachSchema(Posts.schema);

// init search with a function, for dynamic setup
export const postsIndex = new Index({
  collection: Posts,
  fields: ['title', 'body'],
  engine: new MongoDBEngine(),
  permission: (options) => permit.toDo(options.userId, 'posts.search')
});

// define factory generators for tests
Factory.define('post', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs(),
  userId: () => Random.id(),
  categories: () => Random.id()
});
Factory.define('post.fromForm', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs(),
  categories: () => Random.id()
});
