import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { ID_FIELD } from '../core/collections-helpers.js';

// create collection
export const Rooms = new Mongo.Collection('rooms');

// deny everything
Rooms.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Rooms.schema = new SimpleSchema({
  ownerId: ID_FIELD,
  users: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true},
  subscribers: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true}
});
// attach schema
Rooms.attachSchema(Rooms.schema);

// users and subscriptions management
const checkUserId = (userId) => new SimpleSchema({userId: ID_FIELD}).validate({userId});

Rooms.helpers({
  // add a user by its _id
  addUser(userId) {
    checkUserId(userId);
    return Rooms.update(this._id, {$addToSet: {users: userId}});
  },

  // remove user by its _id
  removeUser(userId) {
    checkUserId(userId);
    // ensure is also removed from subscribers
    return Rooms.update(this._id, {$pull: {users: userId, subscribers: userId}});
  },

  // add a subscriber by its _id
  addSubscriber(userId) {
    checkUserId(userId);
    // ensure is also added to users
    return Rooms.update(this._id, {$addToSet: {subscribers: userId, users: userId}});
  },

  // remove subscriber by its _id
  removeSubscriber(userId) {
    checkUserId(userId);
    return Rooms.update(this._id, {$pull: {subscribers: userId}});
  }
});

// define factory generators for tests
Factory.define('room', Rooms, {
  ownerId: () => Random.id(),
  users: () => [Random.id()],
  subscribers: () => [Random.id()]
});
