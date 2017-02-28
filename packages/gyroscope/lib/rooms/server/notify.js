import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks } from '../../core/settings.js';

import { queque } from './queque.js';

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
    _.each(recipientIds, (recipientId) => {
      // set notification in data
      data.notification = notification;
      // set recipient in data
      data.recipientId = recipientId;
      // set sender in data
      data.sender = sender;
      // run the notification with data
      queque.create('notifications', data).save();
    });
  });
  // return the ids of the notified users
  return recipientIds;
};
