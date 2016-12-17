import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Categories } from '../categories.js';
import { CATEGORIES_METHODS_SCHEMA, insert, update } from '../methods.js';
import { ID_FIELD } from '../../core/collections-helpers.js';

import './categories.html';

/**
 * Categories_list
 */
 Template.Categories_list.onCreated(function() {
   this.autorun(() => {
     this.subscribe('categories.all');
   });
 });
Template.Categories_list.helpers({
  categories: () => Categories.find()
});

/**
 * Categories_form_insert
 */
Template.Categories_form_insert.helpers({
  schema() {
    return CATEGORIES_METHODS_SCHEMA;
  }
});

/**
 * Categories_form_update
 */
Template.Categories_form_update.onCreated(function() {
  this.getCategoryId = () => Template.currentData().categoryId;

  this.autorun(() => {
    new SimpleSchema({
      categoryId: ID_FIELD
    }).validate(Template.currentData());

    this.subscribe('categories.single', this.getCategoryId());
  });
});
Template.Categories_form_update.helpers({
  schema() {
    return CATEGORIES_METHODS_SCHEMA;
  },

  category() {
    const instance = Template.instance();

    return Categories.findOne(instance.getCategoryId());
  }
});
