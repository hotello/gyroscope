import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { ID_FIELD, ID_FIELD_OPT } from '../core/collections-helpers.js';

// create collection
export const Notifications = new CollectionFast('notifications', {
  schema: {
    name: {type: String},
    recipientIds: {type: [String], regEx: SimpleSchema.RegEx.Id},
    payload: {type: Object, blackbox: true}
  },
  pickForMethods: []
});
