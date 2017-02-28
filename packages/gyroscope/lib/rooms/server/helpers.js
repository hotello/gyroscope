import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ID_FIELD } from '../../core/collections-helpers.js';
import { Rooms } from '../rooms.js';
import { notify } from './notify.js';

// users and subscriptions management
const isValidUserId = function(userId) {
  return new SimpleSchema({userId: ID_FIELD})
    .namedContext('rooms.helpers')
    .validate({ userId });
};

// adding helpers
Rooms.helpers({
  // add a user by its _id
  addUser(userId) {
    if (isValidUserId(userId)) {
      return Rooms.update(this._id, {$addToSet: {users: userId}});
    } else {
      return false;
    }
  },
  // remove user by its _id
  removeUser(userId) {
    if (isValidUserId(userId)) {
      // ensure is also removed from subscribers
      return Rooms.update(this._id, {$pull: {users: userId, subscribers: userId}});
    } else {
      return false;
    }
  },
  // add a subscriber by its _id
  addSubscriber(userId) {
    if (isValidUserId(userId)) {
      // ensure is also added to users
      return Rooms.update(this._id, {$addToSet: {subscribers: userId, users: userId}});
    } else {
      return false;
    }
  },
  // remove subscriber by its _id
  removeSubscriber(userId) {
    if (isValidUserId(userId)) {
      return Rooms.update(this._id, {$pull: {subscribers: userId}});
    } else {
      return false;
    }
  },
  // notify subscribers of a room
  notify(notification, data) {
    // run notification
    return notify(this.subscribers, notification, data);;
  }
});
