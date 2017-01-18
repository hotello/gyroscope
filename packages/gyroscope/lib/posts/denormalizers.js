import { Posts } from './posts.js';
import { Comments } from '../comments/comments.js';

Posts.hooks.add('insert.before', function(post) {
  // add default comment count
  post.commentCount = 0;
  return post;
});

Posts.hooks.add('remove.before', function(postId) {
  // remove all comments on the post
  if (Meteor.isServer && Posts.findOne(postId)) {
    Comments.remove({postId: postId});
  }
  return postId;
});
