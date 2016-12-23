import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import faker from 'faker';

import { permit, hooks } from '../core/settings.js';
import {
  ID_FIELD,
  ID_FIELD_OPT,
  setCreatedAt,
  setSlugFromTitle,
  toArray
} from '../core/collections-helpers.js';

class CommentsCollection extends Mongo.Collection {
  insert(comment, callback) {
    // set createdAt
    comment.createdAt = new Date();
    // insert comment
    comment._id = super.insert(comment, callback);
    // run comments' after hooks
    hooks.run('comments.insert.after', comment);
    // return the comment's _id as default
    return comment._id;
  }
}
// create collection
export const Comments = new CommentsCollection('comments');

// deny everything
Comments.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Comments.schema = new SimpleSchema({
  createdAt: {type: Date},
  body: {type: String, max: 1500},
  userId: ID_FIELD_OPT,
  postId: ID_FIELD
});
// attach schema
Comments.attachSchema(Comments.schema);

// define factory generators for tests
Factory.define('comment', Comments, {
  body: () => faker.lorem.sentence(),
  userId: () => Random.id(),
  postId: () => Random.id()
});
Factory.define('comment.fromForm', Comments, {
  body: () => faker.lorem.sentence(),
  postId: () => Random.id()
});
