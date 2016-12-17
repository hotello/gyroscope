import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import slug from 'slug';

/**
 * Helpers for SimpleSchema
 */

// ids for schemas
export const ID_FIELD = {type: String, regEx: SimpleSchema.RegEx.Id};
export const ID_FIELD_OPT = {type: String, regEx: SimpleSchema.RegEx.Id, optional: true};

// set creation date automatically
export const setCreatedAt = function() {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return {$setOnInsert: new Date()};
  } else {
    this.unset();
  }
};

// set slug automatically
export const setSlugFromTitle = function() {
  return slug(this.field('title').value);
};

// transform field to array
export const categoriesToArray = function() {
  const categories = this.field('categories').value;

  if (_.isArray(categories)) {
    return categories;
  } else if (_.isString(categories)) {
    return [categories];
  } else {
    this.unset();
  }
}
