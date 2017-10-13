import { Notifications } from './notifications.js';

Notifications.queries.set({
  'all': function(params) {
    const MAX_NOTIFICATIONS = 1000;
    return {
      selector: {},
      options: {
        limit: Math.min(params.limit, MAX_NOTIFICATIONS)
      }
    };
  }
});
