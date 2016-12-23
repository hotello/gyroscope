import { Posts, Categories, Comments } from 'meteor/hotello:gyroscope';

import './body.html';

/**
 * body
 */
Template.body.onCreated(function() {
  this.autorun(() => {
    this.subscribe('posts.random');
    this.subscribe('categories.random');
    this.subscribe('comments.random');
  });
});
Template.body.helpers({
  post: () => Posts.findOne(),
  category: () => Categories.findOne(),
  comment: () => Comments.findOne()
});
