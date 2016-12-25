import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

import { messages, hooks } from '../../core/settings.js';
import { Comments } from '../comments.js';
import { COMMENTS_METHODS_SCHEMA, insert } from '../methods.js';
import { ID_FIELD } from '../../core/collections-helpers.js';

import './comments.html';

/**
 * Comments_list
 */
Template.Comments_list.helpers({
  commentsCollection: () => Comments
});

/**
 * Comments_form_insert
 */
Template.Comments_form_insert.onCreated(function() {
  this.autorun(() => {
    new SimpleSchema({
      postId: ID_FIELD
    }).validate(Template.currentData());
  });
});
Template.Comments_form_insert.helpers({
  schema() {
    return COMMENTS_METHODS_SCHEMA;
  },

  prefill(postId) {
    return postId ? {postId: postId} : {};
  }
});
AutoForm.addHooks('Comments_form_insert', {
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
Template.Comments_form_update.onCreated(function() {
  this.getCommentId = () => Template.currentData().commentId;

  this.autorun(() => {
    new SimpleSchema({
      commentId: ID_FIELD
    }).validate(Template.currentData());

    this.subscribe('comments.single', this.getCommentId());
  });
});
Template.Comments_form_update.helpers({
  schema() {
    return COMMENTS_METHODS_SCHEMA;
  },

  comment() {
    const instance = Template.instance();

    return Comments.findOne(instance.getCommentId());
  }
});
AutoForm.addHooks('Comments_form_update', {
  onSuccess: function(formType, result) {
    hooks.run('comments.forms.update.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('comments.forms.update.onError', error);
  }
});
