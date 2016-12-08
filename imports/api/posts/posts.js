import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Index, MongoDBEngine } from 'meteor/easy:search'
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import faker from 'faker';
import slug from 'slug';

import { ID_FIELD, setCreatedAt } from '../collections-helpers.js';

export const Posts = new Mongo.Collection('posts');

// deny everything
Posts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// set slug automatically
const setSlug = function() {
  return slug(this.field('title').value);
};

// generate schema
Posts.schema = new SimpleSchema({
  createdAt: {type: Date, autoValue: setCreatedAt},
  title: {type: String, max: 500},
  slug: {type: String, unique: true, autoValue: setSlug},
  body: {type: String, max: 3000},
  userId: ID_FIELD
});
// attach schema
Posts.attachSchema(Posts.schema);

export const PostsIndex = new Index({
  collection: Posts,
  fields: ['title', 'body'],
  engine: new MongoDBEngine({
    // permission: (options) => options.userId
  })
});

// define factory generators for tests
Factory.define('post', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs(),
  userId: () => Random.id()
});
Factory.define('post.fromForm', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs()
});
