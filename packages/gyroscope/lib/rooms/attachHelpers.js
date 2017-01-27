import { Meteor } from 'meteor/meteor';

import { Rooms } from './rooms.js';

const addSubscriptionToUser = function(userId, documentId) {
  if (!Meteor.users) return false;
  if (!_.isArray(this.subscriptions)) {
    return Meteor.users.update(userId, {$set: {subscriptions: [documentId]}});
  } else {
    return Meteor.users.update(userId, {$addToSet: {subscriptions: documentId}});
  }
};
const removeSubscriptionFromUser = function(userId, documentId) {
  if (!Meteor.users) return false;
  Meteor.users.update(userId, {$pull: {subscriptions: documentId}});
};

export const attachHelpers = function(collection) {
  collection.helpers({
    // get document's room or create it
    room() {
      const room = Rooms.findOne({ownerId: this._id});
      if (Meteor.isServer) {
        const newRoomId = room ? null : Rooms.insert({ownerId: this._id});
        // return a new room or the existing one
        return newRoomId ? Rooms.findOne(newRoomId) : room;
      } else {
        return room;
      }
    },
    // add subscriber to the room
    addUser(userId) {
      if (Meteor.isServer) {
        return this.room().addUser(userId);
      } else {
        return false;
      }
    },
    // add subscriber to the room
    addSubscriber(userId) {
      if (Meteor.isServer) {
        addSubscriptionToUser(userId, this._id);
        return this.room().addSubscriber(userId);
      } else {
        return false;
      }
    },
    // remove subscriber from room
    removeSubscriber(userId) {
      if (Meteor.isServer) {
        removeSubscriptionFromUser(userId, this._id);
        return this.room().removeSubscriber(userId);
      } else {
        return false;
      }
    },
    // remove subscriber and user from room
    removeUser(userId) {
      if (Meteor.isServer) {
        removeSubscriptionFromUser(userId, this._id);
        return this.room().removeUser(userId);
      } else {
        return false;
      }
    },
    // notify subscribers in room
    notify(notification, data) {
      if (Meteor.isServer) {
        const room = this.room();
        // do not notify if room has no subscribers
        if (!_.has(room, 'subscribers') || room.subscribers.length === 0) return false;
        // run notification
        return room.notify(notification, data);
      } else {
        return false;
      }
    }
  });
};
