import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Posts, PostsIndex } from '../posts.js';
import { POSTS_METHODS_SCHEMA, insert } from '../methods.js';

import './posts.html';

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
