import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { notifications, hooks } from '../../core/settings.js';

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
  // fetch recipients only once
  recipients = hooks.run('notify.fetchRecipients', recipientIds);
  // fetch sender
  sender = hooks.run('notify.fetchSender', data.senderId);
  // notify each user
  Meteor.defer(function() {
    _.each(recipients, (recipient) => {
      const notificationFn = notifications.get(notification);
      // set recipient in data
      data.recipient = recipient;
      // set sender in data
      data.sender = sender;
      // run the notification with data
      notificationFn(data);
    });
  });
  // return the ids of the notified users
  return recipientIds;
};
