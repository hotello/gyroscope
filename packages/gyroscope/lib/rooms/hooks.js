import { _ } from 'meteor/underscore';

import { hooks } from '../core/settings.js';
import { Categories } from '../categories/categories.js';
import { Posts } from '../posts/posts.js';
import { Comments } from '../comments/comments.js';

export const notifyPostOnComment = function(comment, post) {
  return post.notify('comments.insert', { comment, without: [post.userId] });
};
export const notifyCategoryOnPost = function(post) {
  if (_.has(post, 'categories')) {
    _.each(post.categories, (categoryId) => {
      const category = Categories.findOne(categoryId);
      if (category) category.notify('posts.insert', { post });
    });
  }
};
const addSubscriberToPost = function(postId, userId) {
  const post = Posts.findOne(postId);
  // add subscriber to post's room
  if (!!post) post.addSubscriber(userId);
};

// add notification on post insert
Posts.hooks.add('posts.insert.after', function(post) {
  // notify all users subscribed to post's categories
  notifyCategoryOnPost(post);
  // remember to always return on hooks
  return post;
});
// add post's user to subscribers on post insert
Posts.hooks.add('posts.insert.after', function(postId) {
  post = Posts.findOne(postId);
  // add subscriber
  if (post && _.has(post, 'userId')) addSubscriberToPost(post._id, post.userId);
  // remember to always return on hooks
  return post;
});

// add notification on comment insert and add user to post's subscribers
Comments.hooks.add('comments.insert.after', function(commentId) {
  const comment = Comments.findOne(commentId);
  const post = Posts.findOne(comment.postId);
  // notify post's room
  if (post) notifyPostOnComment(comment, post);
  // add user to post's subscribers
  if (post && _.has(comment, 'postId')) addSubscriberToPost(post._id, comment.userId);
  // remember to always return on hooks
  return comment;
});
