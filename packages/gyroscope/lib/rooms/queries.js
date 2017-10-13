import { Notifications } from './notifications.js';

Comments.queries.set({
  'byRecipient': function(params) {
    const MAX_NOTIFICATIONS = 1000;
    return {
      selector: {recipientIds: params.recipientId},
      options: {
        limit: Math.min(params.limit, MAX_NOTIFICATIONS)
      }
    };
  }
});
