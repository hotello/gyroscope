import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Posts, PostsIndex } from '../../../api/posts/posts.js';
import { POSTS_METHODS_SCHEMA, insert } from '../../../api/posts/methods.js';

import './posts.html';

/**
 * Posts_list
 */
Template.Posts_list.helpers({
  postsIndex: () => PostsIndex
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
