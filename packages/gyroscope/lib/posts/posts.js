import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Index, MongoDBEngine } from 'meteor/easy:search'
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import faker from 'faker';

import { permit } from '../core/settings.js';
import {
  ID_FIELD_OPT,
  setCreatedAt,
  setSlugFromTitle,
  toArray
} from '../core/collections-helpers.js';
import { Categories } from '../categories/categories.js';

class PostsCollection extends Mongo.Collection {
  insert(post, callback) {
    let postId;
    // transform post's categories to array
    post.categories = toArray(post.categories);
    // insert post
    postId = super.insert(post, callback);
    // find inserted post
    post = Posts.findOne(postId);
    // notify all users subscribed to post's categories
    if (Meteor.isServer && _.has(post, 'categories')) {
      _.each(post.categories, (categoryId) => {
        const category = Categories.findOne(categoryId);
        if (category) category.notify('posts.insert', { post });
      });
    }
    // return the post's _id as default
    return postId;
  }

  update(selector, modifier, options, callback) {
    // transform post's categories to array
    if (_.has(modifier, '$set') && _.has(modifier.$set, 'categories')) {
      modifier.$set.categories = toArray(modifier.$set.categories);
    }
    // return update result
    return super.update(selector, modifier, options, callback);
  }
}
// create collection
export const Posts = new PostsCollection('posts');

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
