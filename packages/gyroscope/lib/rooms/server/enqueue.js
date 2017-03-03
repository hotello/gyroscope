import async from 'async';

export const enqueue = function(job, done) {
  console.log('ENQUEUE')
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
  // iterate with async on the generated array
  async.eachOfSeries(notificationJobs, function(notificationJob, index, callback) {
    if (isIncompleteJob && index < resumeIndex) {
      callback();
    } else {
      notificationsQueue
      .create('notifications', notificationJob)
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
