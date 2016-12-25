import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { FlexibleCollection } from '../core/flexible-collection.js';
import { hooks } from '../core/settings.js';
import { ID_FIELD, ID_FIELD_OPT } from '../core/collections-helpers.js';

// create collection
export const Comments = new FlexibleCollection('comments');

// deny everything
Comments.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// generate schema
Comments.schema = new SimpleSchema({
  body: {type: String, max: 1500},
  userId: ID_FIELD_OPT,
  postId: ID_FIELD
});
// attach schema
Comments.attachSchema(Comments.schema);
