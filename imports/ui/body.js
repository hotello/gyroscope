import { Posts, Categories } from 'meteor/hotello:gyroscope';

import './body.html';

/**
 * body
 */
Template.body.onCreated(function() {
  this.autorun(() => {
    this.subscribe('posts.random');
    this.subscribe('categories.random');
  });
});
Template.body.helpers({
  post: () => Posts.findOne(),
  category: () => Categories.findOne()
});
