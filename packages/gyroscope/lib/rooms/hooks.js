import { _ } from 'meteor/underscore';

import { hooks } from '../core/settings.js';
import { Categories } from '../categories/categories.js';
import { Posts } from '../posts/posts.js';
import { Comments } from '../comments/comments.js';

export const notifyPostOnComment = function(comment, post) {
  return post.notify('comments.insert', { comment, without: [post.userId] });
};
export const notifyCategoryOnPost = function(post) {
  if (post && _.has(post, 'categories')) {
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
Posts.hooks.add('posts.insert.after', function({ result, doc }) {
  // set id on doc
  doc._id = result;
  // notify all users subscribed to post's categories
  notifyCategoryOnPost(doc);
  // remember to always return on hooks
  return { result, doc };
});
// add post's user to subscribers on post insert
Posts.hooks.add('posts.insert.after', function({ result, doc }) {
  // add subscriber
  if (doc && _.has(doc, 'userId')) addSubscriberToPost(doc._id, doc.userId);
  // remember to always return on hooks
  return { result, doc };
});

// add notification on comment insert and add user to post's subscribers
Comments.hooks.add('comments.insert.after', function({ result, doc }) {
  const comment = doc;
  const post = Posts.findOne(comment.postId);
  // notify post's room
  if (post) notifyPostOnComment(comment, post);
  // add user to post's subscribers
  if (post && _.has(comment, 'postId')) addSubscriberToPost(post._id, comment.userId);
  // remember to always return on hooks
  return { result, doc };
});
