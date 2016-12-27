import { Template } from 'meteor/templating';

import { hooks } from '../../core/settings.js';
import { Posts } from '../posts.js';

import './posts.html';

/**
 * Posts_list
 */
Template.Posts_list.helpers({
  collection: () => Posts
});

/**
 * Posts_item
 */
Template.Posts_item.helpers({
  collection: () => Posts
});

/**
 * Posts_form_insert
 */
Template.Posts_form_insert.helpers({
  collection: () => Posts,
  getDoc: (categoryId) => {
    return categoryId ? {categories: [categoryId]} : {};
  }
});
AutoForm.addHooks('posts.forms.insert', {
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
Template.Posts_form_update.helpers({
  collection: () => Posts
});
AutoForm.addHooks('posts.forms.update', {
  onSuccess: function(formType, result) {
    hooks.run('posts.forms.update.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('posts.forms.update.onError', error);
  }
});
