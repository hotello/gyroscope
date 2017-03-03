import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks, payloads } from '../../core/settings.js';
import { Notifications } from '../notifications.js';
import { notificationsQueue } from './queues.js';

export const notify = function(recipientIds, name, data) {
  // check correct function call
  new SimpleSchema({
    recipientIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
    name: {type: String},
    data: {type: Object, blackbox: true}
  }).validate({ recipientIds, name, data });
  // omit some subscribers
  if (_.has(data, 'without')) {
    recipientIds = _.difference(recipientIds, data.without);
    data = _.omit(data, 'without')
  }
  // generate payload with hook
  const payloadFn = payloads.get(name);
  const payload = payloadFn(data);
  // create the notification document
  const notificationId = Notifications.insert({
    name,
    recipientIds,
    payload
  });
  // provide a fallback if redis is not used
  if (!!notificationsQueue) {
    // create enqueuing job
    const job = notificationsQueue
      .create('enqueue', { recipientIds, notificationId })
      .priority('high')
      .removeOnComplete(true)
      .save();
  } else {
    _.each(recipientIds, (recipientId) => {
      const notificationFn = notifications.get(name);
      const done = function() {};
      // run the notification with data
      notificationFn(recipientId, payload, done);
    });
  }
  // return the ids of the notified users
  return recipientIds;
};
