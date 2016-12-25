import { Meteor } from 'meteor/meteor';

import { permit, queries } from '../../core/settings.js';
import { ID_FIELD } from '../../core/collections-helpers.js';
import { generatePublishByQuery } from '../../core/server/generatePublishByQuery.js';
import { Posts } from '../posts.js';

Meteor.publish('posts.byQuery', generatePublishByQuery({
  collection: Posts,
  permissionName: 'posts.publish.byQuery'
}));

Meteor.publish('posts.single', function(postId) {
  new SimpleSchema({
    postId: ID_FIELD
  }).validate({ postId });

  if (permit.notToDo(this.userId, 'posts.publish.single', { postId })) {
    return this.ready();
  }

  return Posts.find(postId);
});
