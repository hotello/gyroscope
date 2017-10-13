const withUser = (userId, data) => !!userId;
const noUser = (userId, data) => true;

export const config = {
  general: {
    'notifications.interval': 500,
    'notifications.intervalThreshold': 49,
    'notifications.enqueueConcurrency': 2,
    'notifications.enqueueAsyncConcurrency': 100,
    'notifications.notifyConcurrency': 2
  },

  permit: {
    'posts.insert': withUser,
    'posts.update': withUser,
    'posts.remove': withUser,
    'posts.publish.byQuery': noUser,
    'posts.publish.single': noUser,
    'posts.addSubscriber': noUser,
    'posts.removeSubscriber': noUser,
    'posts.removeUser': noUser,

    'categories.insert': withUser,
    'categories.update': withUser,
    'categories.remove': withUser,
    'categories.publish.byQuery': noUser,
    'categories.publish.single': noUser,
    'categories.addSubscriber': noUser,
    'categories.removeSubscriber': noUser,
    'categories.removeUser': noUser,

    'comments.insert': withUser,
    'comments.update': withUser,
    'comments.remove': withUser,
    'comments.publish.byQuery': noUser,
    'comments.publish.single': noUser,

    'notifications.publish.byQuery': noUser,
    'notifications.publish.single': noUser
  },

  notifications: {
    'posts.insert': function(data) {
      console.log(`Notified posts.insert for: ${data.post.title}`);
    },
    'comments.insert': function(data) {
      console.log(`Nofified comments.insert for: ${data.comment.body}`);
    }
  },

  payloads: {
    'posts.insert': data => data,
    'comments.insert': data => data
  }
};
