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

// set slug automatically from title
export const setSlugFromTitle = function() {
  return slug(this.field('title').value);
};

// set slug automatically from name
export const setSlugFromName = function() {
  return slug(this.field('name').value);
};

// transform to array
export const toArray = function(value) {
  if (_.isArray(value)) {
    return value;
  } else if (_.isString(value)) {
    return [value];
  } else {
    return [];
  }
}
