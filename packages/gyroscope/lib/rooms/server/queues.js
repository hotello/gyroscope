import { Meteor } from 'meteor/meteor';

import kue from 'kue';
import async from 'async';

import { notifications, general } from '../../core/settings.js';
import { Notifications } from '../notifications.js';

// export the notifications queue
export let notificationsQueue = null;

// init the queue only if a redis url is defined
if (!!process.env.REDIS_URL) {
  notificationsQueue = kue.createQueue({redis: process.env.REDIS_URL});
  kue.app.listen(4000);
} else {
  console.log('Provide a REDIS_URL env variable for notifications queueing.');
}

// enqueue job for notifications
const enqueue = function(job, ctx, done) {
  // generate a delay for notifications
  const getDelay = function(index, count) {
    const threshold = general.get('notifications.intervalThreshold');
    if (count > threshold) {
      return index * general.get('notifications.interval');
    } else {
      return 0;
    }
  };
  // set the job's data
  const recipientIds = job.data.recipientIds;
  const notificationId = job.data.notificationId;
  // set some constants for job
  const isIncompleteJob = !!job.progress_data && !!job.progress_data.index;
  let resumeIndex = 0;
  if (isIncompleteJob) resumeIndex = job.progress_data.index + 1;
  // map recipient ids to generate a notification jobs array to iterate
  const notificationJobs = _.map(recipientIds, function(recipientId) {
    return { recipientId, notificationId };
  });
  // set job initial progress if job is not an incomlete one
  if (!isIncompleteJob) {
    job.progress(0, recipientIds.length, { index: 0 });
  }
  // get settings for concurrency
  const enqueueAsyncConcurrency = general.get('notifications.enqueueAsyncConcurrency');
  // iterate with async on the generated array
  async.eachOfLimit(notificationJobs, enqueueAsyncConcurrency, function(notificationJob, index, callback) {
    if (isIncompleteJob && index < resumeIndex) {
      callback();
    } else {
      notificationsQueue
      .create('notify', notificationJob)
      .delay(getDelay(index, recipientIds.length))
      .removeOnComplete(true)
      .save(function() {
        kue.Job.get(job.id, function(err, newJob) {
          if (newJob.progress_data.index < index) {
            job.progress(index, recipientIds.length, { index });
          }
          callback();
        });
      });
    }
  }, function(err) {
    done();
  });
};

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
    'enqueue',
    general.get('notifications.enqueueConcurrency'),
    Meteor.bindEnvironment(enqueue)
  );
  notificationsQueue.process(
    'notify',
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
