import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks } from '../../core/settings.js';

export const notify = function(userIds, notification, data) {
  let users;
  // check correct function call
  new SimpleSchema({
    userIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
    notification: {type: String},
    data: {type: Object, blackbox: true}
  }).validate({ userIds, notification, data });
  // omit some subscribers
  if (_.has(data, 'without')) {
    userIds = _.difference(userIds, data.without);
    data = _.omit(data, 'without')
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
  // return the ids of the notified users
  return userIds;
};
