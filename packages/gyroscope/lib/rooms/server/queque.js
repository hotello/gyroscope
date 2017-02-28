import { Meteor } from 'meteor/meteor';
import Queque from 'bull';

import { notifications } from '../../core/settings.js';

// export queque variable null as default
export let queque = null;

// noification job for bull
const notifyJob = function(job) {
  // get notification function
  const notificationFn = notifications.get(job.data.notification);
  // process notification
  const result = notificationFn(job.data);
  // complete job
  return Promise.resolve(result);
};

// log if process is not worker
if (process.env.WORKER_OFF == 1) {
  console.log('Workers are off on this process.');
}

// initialize queque if REDIS_URL is provided else log an instruction message
if (process.env.REDIS_URL) {
  queque = Queque('notifications', process.env.REDIS_URL);
} else {
  console.log('For better notification management provide a Redis connection url as REDIS_URL env variable.');
}

// process the notifications queque
if (process.env.REDIS_URL && !process.env.WORKER_OFF == 1) {
  console.log('Starting notifications queque processing.');
  queque.process(Meteor.bindEnvironment(notifyJob));
}
