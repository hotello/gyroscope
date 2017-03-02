import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks } from '../../core/settings.js';

import { notificationsQueue } from './notificationsQueue.js';

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
  // add notification's name to data
  data.notification = notification;
  // provide a fallback if redis is not used
  if (!!notificationsQueue) {
    // create enqueuing job
    notificationsQueue
      .create('enqueuing', { recipientIds, data })
      .priority('high')
      .removeOnComplete(true)
      .save();
  } else {
    _.each(recipientIds, (recipientId) => {
      const notificationFn = notifications.get(notification);
      // set recipient in data
      data.recipientId = recipientId;
      // run the notification with data
      notificationFn(data);
    });
  }
  // return the ids of the notified users
  return recipientIds;
};
