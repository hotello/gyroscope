import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { notifications } from '../core/settings.js';
import { Rooms } from './rooms.js';

const notify = function(userIds, notification, data) {
  new SimpleSchema({
    userIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
    notification: {type: String},
    data: {type: Object, blackbox: true}
  }).validate({ userIds, notification, data });
  // notify each user
  _.each(userIds, (userId) => {
    const notificationFn = notifications.get(notification);
    // set userId in data
    data.userId = userId;
    // run the notification with data
    notificationFn(data);
  });
};

// register helpers only on server for notifications
Rooms.helpers({
  // notify subscribers of a room
  notify(notification, data) {
    notify(this.subscribers, notification, data);
    // return notified users
    return this.subscribers;
  }
});