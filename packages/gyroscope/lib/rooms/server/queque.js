import kue from 'kue';

import { notifications } from '../../core/settings.js';

// initialize kue queque
export const queque = kue.createQueue({
  redis: process.env.REDIS_URL
});

// process the notifications queque
queque.process('notifications', function(job, done){
  // get notification function
  const notificationFn = notifications.get(job.data.notification);
  // process notification
  notificationFn(job.data);
  // set job as done
  done();
});
