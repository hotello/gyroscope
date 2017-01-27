import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ID_FIELD } from '../../core/collections-helpers.js';
import { Rooms } from '../rooms.js';
import { notify } from './notify.js';

// users and subscriptions management
const checkUserId = (userId) => new SimpleSchema({userId: ID_FIELD}).validate({userId});

// adding helpers
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
  },
  // notify subscribers of a room
  notify(notification, data) {
    // run notification
    return notify(this.subscribers, notification, data);;
  }
});
