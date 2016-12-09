import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Helpers for SimpleSchema
 */

// ids for schemas
export const ID_FIELD = {type: String, regEx: SimpleSchema.RegEx.Id};

// set creation date automatically
export const setCreatedAt = function() {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return {$setOnInsert: new Date()};
  } else {
    this.unset();
  }
}
