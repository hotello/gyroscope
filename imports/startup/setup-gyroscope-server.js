import {
  Posts,
  Categories,
  Comments,
  notifications,
  sendEmail,
  general,
  hooks
} from 'meteor/hotello:gyroscope';

// pass enclosing app assets object to gyroscope package
general.set({
  'assets': Assets,
  'assets.emailTemplates': 'email-templates'
});
// setup notifications
notifications.set({
  'posts.insert': function(data) {
    sendEmail('custom', {
      // get user object from id with data.userId
      to: `${data.user.email}`,
      from: 'test@gyroscope.com',
      replyTo: 'test@gyroscope.com',
      subject: 'New post on Gyroscope Test App',
    }, {
      body: `A new post was created: ${data.post.title}`,
      callToAction: {
        url: `http://gyroscope-test.com/posts/${data.post._id}`,
        label: 'Go to post'
      }
    });
  },
  'comments.insert': function(data) {
    sendEmail('custom', {
      // get user object from id with data.userId
      to: `${data.user.email}`,
      from: 'test@gyroscope.com',
      replyTo: 'test@gyroscope.com',
      subject: 'New comment on Gyroscope Test App',
    }, {
      body: `A new comment was created: ${data.comment.body}`,
      callToAction: {
        url: `http://gyroscope-test.com/posts/${data.comment.postId}`,
        label: 'Go to post'
      }
    });
  }
});
// fetch users for notifications
hooks.add('notify.fetchUsers', function(userIds) {
  return _.map(userIds, (userId) => {
    return {email: `${userId}@email.com`};
  }); /* Meteor.users.find({_id: {$in: userIds}}).fetch() */
});

// some publications
Meteor.publish('posts.random', function() {
  const posts = Posts.find({}, {limit: 1});
  const post = posts.fetch()[0];
  if (!_.has(post.room(), 'subscribers')) post.addSubscriber(Random.id());
  return posts;
});
Meteor.publish('categories.random', function() {
  const categories = Categories.find({}, {limit: 1});
  const category = categories.fetch()[0];
  if (!_.has(category.room(), 'subscribers')) category.addSubscriber(Random.id());
  return categories;
});
Meteor.publish('comments.random', function() {
  const comments = Comments.find({}, {limit: 1});
  const comment = comments.fetch()[0];
  const post = Posts.findOne();
  Comments.update(comment._id, {$set: {postId: post._id}});
  return comments;
});
