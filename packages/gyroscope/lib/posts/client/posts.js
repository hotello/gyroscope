import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { messages } from '../../core/gyroscope.js';
import { Posts, postsIndex } from '../posts.js';
import { POSTS_METHODS_SCHEMA, insert } from '../methods.js';
import { ID_FIELD } from '../../core/collections-helpers.js';

import './posts.html';

/**
 * Posts_list
 */
Template.Posts_list.helpers({
  postsIndex: () => postsIndex,
  loadMoreMessage: () => messages.get('posts.loadMore')
});

/**
 * Posts_item
 */
Template.Posts_item.onCreated(function() {
  this.getPostId = () => Template.currentData().postId;

  this.autorun(() => {
    new SimpleSchema({
      postId: ID_FIELD
    }).validate(Template.currentData());

    this.subscribe('posts.single', this.getPostId());
  });
});
Template.Posts_item.helpers({
  post() {
    const instance = Template.instance();

    return Posts.findOne(instance.getPostId());
  }
});

/**
 * Posts_form_insert
 */
Template.Posts_form_insert.helpers({
  schema() {
    return POSTS_METHODS_SCHEMA;
  },

  prefill(categoryId) {
    return categoryId ? {categories: categoryId} : {};
  }
});

/**
 * Posts_form_update
 */
Template.Posts_form_update.onCreated(function() {
  this.getPostId = () => Template.currentData().postId;

  this.autorun(() => {
    new SimpleSchema({
      postId: ID_FIELD
    }).validate(Template.currentData());

    this.subscribe('posts.single', this.getPostId());
  });
});
Template.Posts_form_update.helpers({
  schema() {
    return POSTS_METHODS_SCHEMA;
  },

  post() {
    const instance = Template.instance();

    return Posts.findOne(instance.getPostId());
  }
});
