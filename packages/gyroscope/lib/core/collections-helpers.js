import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

/**
 * Helpers for SimpleSchema
 */

// ids for schemas
export const ID_FIELD = {type: String, regEx: SimpleSchema.RegEx.Id};
export const ID_FIELD_OPT = {type: String, regEx: SimpleSchema.RegEx.Id, optional: true};

// transform to array
export const toArray = function(value) {
  if (_.isArray(value)) {
    return value;
  } else if (_.isString(value)) {
    return [value];
  } else {
    return [];
  }
};
