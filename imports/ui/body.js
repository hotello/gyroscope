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

/**
 * postsList
 */
Template.postsList.helpers({
  query: (categoryId) => {
    const perPage = 5;
    return {
      name: 'posts.byCategory',
      params: { categoryId, perPage }
    };
  }
});
Template.postsList.events({
  'click .js-load-more'() {
    this.loadMore();
  }
});

/**
 * categoriesList
 */
Template.categoriesList.helpers({
  query: () => {
    const perPage = 5;
    return {
      name: 'categories.all',
      params: { perPage }
    };
  }
});
Template.categoriesList.events({
  'click .js-load-more'() {
    this.loadMore();
  }
});

/**
 * categoriesList
 */
Template.commentsList.helpers({
  query: (postId) => {
    const perPage = 5;
    return {
      name: 'comments.byPost',
      params: { postId, perPage }
    };
  }
});
Template.categoriesList.events({
  'click .js-load-more'() {
    this.loadMore();
  }
});
