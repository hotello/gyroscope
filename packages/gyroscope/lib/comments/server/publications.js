import { Meteor } from 'meteor/meteor';

import { permit } from '../../core/settings.js';
import { ID_FIELD } from '../../core/collections-helpers.js';
import { Comments } from '../comments.js';
import { generatePublishByQuery } from '../../core/server/generatePublishByQuery.js';

Meteor.publish('comments.byQuery', generatePublishByQuery({
  collection: Comments,
  permissionName: 'comments.publish.byQuery'
}));

Meteor.publish('comments.single', function(commentId) {
  new SimpleSchema({
    commentId: ID_FIELD
  }).validate({ commentId });

  if (permit.notToDo(this.userId, 'comments.publish.single', { commentId })) {
    return this.ready();
  }

  return Comments.find(commentId);
});
