import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { ID_FIELD } from '../core/collections-helpers.js';

// create collection
export const Rooms = new Mongo.Collection('rooms');

// deny everything
Rooms.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Rooms.schema = new SimpleSchema({
  ownerId: ID_FIELD,
  users: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true},
  subscribers: {type: [String], regEx: SimpleSchema.RegEx.Id, optional: true}
});
// attach schema
Rooms.attachSchema(Rooms.schema);
