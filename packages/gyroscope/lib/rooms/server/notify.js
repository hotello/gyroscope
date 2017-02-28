import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks, general } from '../../core/settings.js';

import { queque } from './queque.js';

const getDelay = function(index) {
  return index * general.get('notifications.interval');
};

export const notify = function(recipientIds, notification, data) {
  let recipients;
  let sender;
  // check correct function call
  new SimpleSchema({
    recipientIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
    notification: {type: String},
    data: {type: Object, blackbox: true}
  }).validate({ recipientIds, notification, data });
  // omit some subscribers
  if (_.has(data, 'without')) {
    recipientIds = _.difference(recipientIds, data.without);
    data = _.omit(data, 'without')
  }
  // fetch sender
  sender = hooks.run('notify.fetchSender', data.senderId);
  // notify each user
  Meteor.defer(function() {
    _.each(recipientIds, (recipientId, index) => {
      // set notification in data
      data.notification = notification;
      // set recipient in data
      data.recipientId = recipientId;
      // set sender in data
      data.sender = sender;
      // run the notification with data
      if (queque) {
        queque.add(data, {delay: getDelay(index)});
      } else {
        const notificationFn = notifications.get(data.notification);
        notificationFn(data);
      }
    });
  });
  // return the ids of the notified users
  return recipientIds;
};
