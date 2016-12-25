import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

/**
 * Helpers for SimpleSchema
 */

// extend/override fields of the schema
export const extendSchema = function(collection, fields) {
  collection.attachSchema(
    _.extend(collection.schema._schema, fields),
    {replace: true}
  );
};

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
