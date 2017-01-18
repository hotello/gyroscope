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
 * Categories_item
 */
Template.Categories_item.helpers({
  collection: () => Categories
});

/**
 * Categories_form_insert
 */
Template.Categories_form_insert.helpers({
  collection: () => Categories
});

/**
 * Categories_form_update
 */
Template.Categories_form_update.helpers({
  collection: () => Categories
});
