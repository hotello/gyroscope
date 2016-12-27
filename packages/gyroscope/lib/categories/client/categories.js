import { Template } from 'meteor/templating';

import { hooks } from '../../core/settings.js';
import { Categories } from '../categories.js';

import './categories.html';

/**
 * Categories_list
 */
Template.Categories_list.helpers({
  collection: () => Categories
});

/**
 * Categories_form_insert
 */
Template.Categories_form_insert.helpers({
  collection: () => Categories
});
AutoForm.addHooks('categories.forms.insert', {
  onSuccess: function(formType, result) {
    hooks.run('categories.forms.insert.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('categories.forms.insert.onError', error);
  }
});

/**
 * Categories_form_update
 */
Template.Categories_form_update.helpers({
  collection: () => Categories
});
AutoForm.addHooks('categories.forms.update', {
  onSuccess: function(formType, result) {
    hooks.run('categories.forms.update.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('categories.forms.update.onError', error);
  }
});
