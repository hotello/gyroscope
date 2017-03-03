import { Meteor } from 'meteor/meteor';

import kue from 'kue';
import async from 'async';

import { notifications, general } from '../../core/settings.js';
import { Notifications } from '../notifications.js';
import { enqueue } from './enqueue.js';

// export the notifications queue
export let notificationsQueue = null;

// init the queue only if a redis url is defined
if (!!process.env.REDIS_URL) {
  notificationsQueue = kue.createQueue({redis: process.env.REDIS_URL});
} else {
  console.log('Provide a REDIS_URL env variable for notifications queueing.');
}

// notification job
const notify = function(job, ctx, done) {
  // get the notification document
  const notification = Notifications.findOne(job.data.notificationId, {
    fields: {name: 1, payload: 1}
  });
  // get notification function
  const notificationFn = notifications.get(notification.name);
  // process notification
  notificationFn(job.data.recipientId, notification.payload, done);
};

// start processing the queues only if process is worker
if (process.env.IS_WORKER == 1) {
  console.log('Notifications queue processing is ON in this process.');
  notificationsQueue.process(
    'enqueuing',
    general.get('notifications.enqueueConcurrency'),
    enqueue
  );
  notificationsQueue.process(
    'notifications',
    general.get('notifications.notifyConcurrency'),
    Meteor.bindEnvironment(notify)
  );
  // watch queue
  notificationsQueue.watchStuckJobs(1000);
  // get active jobs and solve stuck jobs
  notificationsQueue.active(function(err, ids) {
    ids.forEach(function(id) {
      kue.Job.get(id, function(err, job) {
        job.inactive();
      });
    });
  });
} else {
  console.log('Notifications queue processing is OFF in this process.');
}
