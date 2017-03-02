import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ID_FIELD, ID_FIELD_OPT } from '../core/collections-helpers.js';

// create collection
export const Notifications = new Mongo.Collection('notifications');

// deny everything
Notifications.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Notifications.schema = new SimpleSchema({
  name: {type: String},
  recipientIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
  payload: {type: Object, blackbox: true}
});
// attach schema
Notifications.attachSchema(Notifications.schema);
