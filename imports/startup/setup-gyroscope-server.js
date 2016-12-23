import { Random } from 'meteor/random';
import {
  Posts,
  Categories,
  Comments,
  notifications,
  sendEmail,
  general
} from 'meteor/hotello:gyroscope';

// some publications
Meteor.publish('posts.random', function() {
  return Posts.find({}, {limit: 1});
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
      to: `${data.userId}@user.com`,
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
  }
});
