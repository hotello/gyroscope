import { Template } from 'meteor/templating';

import { hooks } from '../../core/settings.js';
import { Comments } from '../comments.js';

import './comments.html';

/**
 * Comments_list
 */
Template.Comments_list.helpers({
  collection: () => Comments
});

/**
 * Comments_form_insert
 */
Template.Comments_form_insert.helpers({
  collection: () => Comments,
  getDoc: (postId) => {
    return postId ? {postId: postId} : {};
  }
});
AutoForm.addHooks('comments.forms.insert', {
  onSuccess: function(formType, result) {
    hooks.run('comments.forms.insert.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('comments.forms.insert.onError', error);
  }
});

/**
 * Comments_form_update
 */
Template.Comments_form_update.helpers({
  collection: () => Comments
});
AutoForm.addHooks('comments.forms.update', {
  onSuccess: function(formType, result) {
    hooks.run('comments.forms.update.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('comments.forms.update.onError', error);
  }
});
