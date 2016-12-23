import { Meteor } from 'meteor/meteor';

import { permit } from '../../core/settings.js';
import { ID_FIELD } from '../../core/collections-helpers.js';
import { Comments } from '../comments.js';

Meteor.publish('comments.byPost', function(postId) {
  new SimpleSchema({
    postId: ID_FIELD
  }).validate({ postId });

  if (permit.notToDo(this.userId, 'comments.publish.byPost', { postId })) {
    return this.ready();
  }

  return Comments.find({postId: postId});
});

Meteor.publish('comments.single', function(commentId) {
  new SimpleSchema({
    commentId: ID_FIELD
  }).validate({ commentId });

  if (permit.notToDo(this.userId, 'comments.publish.single', { commentId })) {
    return this.ready();
  }

  return Comments.find(commentId);
});
