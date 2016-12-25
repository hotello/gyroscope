import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import { ReactiveDict } from 'meteor/reactive-dict';

import { messages, hooks, queries } from '../../core/settings.js';
import { Posts } from '../posts.js';
import { POSTS_METHODS_SCHEMA, insert } from '../methods.js';
import { ID_FIELD } from '../../core/collections-helpers.js';

import './posts.html';

/**
 * Posts_list
 */
Template.Posts_list.helpers({
  postsCollection: () => Posts
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
    // subscribe by post id
    this.subscribe('posts.single', this.getPostId());
  });
});
Template.Posts_item.helpers({
  post(postId) {
    return Posts.findOne(postId);
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
AutoForm.addHooks('Posts_form_insert', {
  onSuccess: function(formType, result) {
    hooks.run('posts.forms.insert.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('posts.forms.insert.onError', error);
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
AutoForm.addHooks('Posts_form_update', {
  onSuccess: function(formType, result) {
    hooks.run('posts.forms.update.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('posts.forms.update.onError', error);
  }
});
