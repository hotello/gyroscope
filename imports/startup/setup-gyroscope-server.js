import {
  Posts,
  Categories,
  Comments,
  notifications,
  general,
  hooks,
  payloads
} from 'meteor/hotello:gyroscope';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';

general.set({
  'notifications.interval': 1000
});

// setup notifications
notifications.set({
  'posts.insert': function(recipientId, payload, done) {
    console.log('Post notification for: %s', recipientId);
    if (done) done();
  },
  'comments.insert': function(recipientId, payload, done) {
    console.log('Comment notification for: %s', recipientId);
    if (done) done();
  }
});

payloads.set({
  'posts.insert': function(data) {
    // preload documents for the notification
    return data;
  },
  'comments.insert': function(data) {
    // preload documents for the notification
    return data;
  }
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
  if (!_.has(category.room(), 'subscribers')) {
    _.times(10, function() {
      category.addSubscriber(Random.id());
    });
  }
  return categories;
});
Meteor.publish('comments.random', function() {
  const comments = Comments.find({}, {limit: 1});
  const comment = comments.fetch()[0];
  const post = Posts.findOne();
  Comments.update(comment._id, {$set: {postId: post._id}});
  return comments;
});

// generate some demo data
Factory.define('post', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs(),
  userId: () => Random.id(),
  categories: () => [Random.id()]
});
Factory.define('category', Categories, {
  name: () => faker.lorem.words()
});
Factory.define('comment', Comments, {
  body: () => faker.lorem.sentence(),
  userId: () => Random.id(),
  postId: () => Random.id()
});

Meteor.startup(function() {
  if(!Posts.findOne()) {
    _.times(25, function() {
      Factory.create('post');
    });
  }

  if(!Categories.findOne()) {
    _.times(10, function() {
      Factory.create('category');
    });
  }

  if(!Comments.findOne()) {
    _.times(10, function() {
      Factory.create('comment');
    });
  }
});
