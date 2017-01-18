import { CollectionFast } from 'meteor/hotello:collection-fast';
import { Posts } from '../posts/posts.js';

import { ID_FIELD, ID_FIELD_OPT } from '../core/collections-helpers.js';

// create collection
export const Comments = new CollectionFast('comments', {
  schema: {
    body: {type: String, max: 1500},
    userId: ID_FIELD_OPT,
    postId: ID_FIELD
  },
  pickForMethods: ['body', 'postId']
});

// comments helpers
Comments.helpers({
  // get comment's post
  post() {
    return Posts.findOne(this.postId);
  }
});
