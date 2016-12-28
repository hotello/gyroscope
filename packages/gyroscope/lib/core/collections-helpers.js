import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Helpers for SimpleSchema
 */

// ids for schemas
export const ID_FIELD = {type: String, regEx: SimpleSchema.RegEx.Id};
export const ID_FIELD_OPT = {type: String, regEx: SimpleSchema.RegEx.Id, optional: true};
