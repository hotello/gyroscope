import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Gyroscope } from '../../core/gyroscope.js';
import { Posts, PostsIndex } from '../posts.js';
import { POSTS_METHODS_SCHEMA, insert } from '../methods.js';
import { ID_FIELD } from '../../core/collections-helpers.js';

import './posts.html';

/**
 * Posts_list
 */
Template.Posts_list.helpers({
  postsIndex: () => PostsIndex,
  loadMoreMessage: () => Gyroscope.messages.get('posts.loadMore')
});

/**
 * Posts_item
 */
Template.Posts_item.onCreated(function() {
  this.autorun(() => {
    new SimpleSchema({
      postId: ID_FIELD
    }).validate(Template.currentData());

    this.getPostId = () => Template.currentData().postId;

    this.subscribe('posts.single', this.getPostId());
  });
});
Template.Posts_item.helpers({
  post: function() {
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
  }
});

/**
 * Posts_form_update
 */
Template.Posts_form_update.onCreated(function() {
  this.autorun(() => {
    new SimpleSchema({
      post: {type: Posts.schema}
    }).validate(Template.currentData());
  });
});
