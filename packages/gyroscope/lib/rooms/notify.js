import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks } from '../core/settings.js';
import { Rooms } from './rooms.js';

const notify = function(userIds, notification, data) {
  let users;

  new SimpleSchema({
    userIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
    notification: {type: String},
    data: {type: Object, blackbox: true}
  }).validate({ userIds, notification, data });

  // omit some subscribers
  if (_.has(data, 'without')) {
    userIds = _.difference(userIds, data.without);
  }
  // fetch users only once
  users = hooks.run('notify.fetchUsers', userIds);
  // notify each user
  _.each(users, (user) => {
    const notificationFn = notifications.get(notification);
    // set userId in data
    data.user = user;
    // run the notification with data
    notificationFn(data);
  });

  return userIds;
};

// register helpers only on server for notifications
Rooms.helpers({
  // notify subscribers of a room
  notify(notification, data) {
    // run notification
    return notify(this.subscribers, notification, data);;
  }
});
