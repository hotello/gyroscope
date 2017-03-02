import { Meteor } from 'meteor/meteor';

import kue from 'kue';
import async from 'async';

import { notifications, general } from '../../core/settings.js';

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
  // get notification function
  const notificationFn = notifications.get(job.data.notification);
  // process notification
  notificationFn(job.data, done);
};
// enqueuing job
const enqueue = function(job, done) {
  // generate a delay for notifications
  const getDelay = function(index, count) {
    const threshold = general.get('notifications.intervalThreshold');
    if (count > threshold) {
      return index * general.get('notifications.interval');
    } else {
      return 0;
    }
  };
  // generate an array of job data items to iterate on with async
  const recipientIds = job.data.recipientIds;
  // pick remaining recipients if enqueuing job got stuck
  const data = job.data.data;
  // set some constants for job
  const isIncompleteJob = !!job.progress_data && !!job.progress_data.index;
  let resumeIndex = 0;
  if (isIncompleteJob) resumeIndex = job.progress_data.index + 1;
  const mappedData = _.map(recipientIds, function(recipientId) {
    const item = _.clone(data);
    item.recipientId = recipientId;
    return item;
  });
  // iterate with async on the generate array
  async.eachOfLimit(mappedData, 50, function(dataItem, index, callback) {
    if (isIncompleteJob && index < resumeIndex) {
      callback();
    } else {
      notificationsQueue
      .create('notifications', dataItem)
      .delay(getDelay(index, recipientIds.length))
      .removeOnComplete(true)
      .save(function() {
        job.progress(index, recipientIds.length, { index });
        callback();
      });
    }
  }, function(err) {
    done();
  });
};

// start processing the queues only if process is worker
if (process.env.IS_WORKER == 1) {
  console.log('Notifications queue processing is ON in this process.')
  notificationsQueue.process(
    'enqueuing',
    enqueue
  );
  notificationsQueue.process(
    'notifications',
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
  console.log('Notifications queue processing is OFF in this process.')
}
