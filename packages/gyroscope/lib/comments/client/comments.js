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
 * Comments_item
 */
Template.Comments_item.helpers({
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

/**
 * Comments_form_update
 */
Template.Comments_form_update.helpers({
  collection: () => Comments
});
