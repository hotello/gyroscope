import { Meteor } from 'meteor/meteor';

import { hooks } from '../core/settings.js';
import { Categories } from '../categories/categories.js';
import { Posts } from '../posts/posts.js';

// add notification on post insert
hooks.add('posts.insert.after', function(post) {
  // notify all users subscribed to post's categories
  if (_.has(post, 'categories')) {
    _.each(post.categories, (categoryId) => {
      const category = Categories.findOne(categoryId);
      if (category) category.notify('posts.insert', { post });
    });
  }
  // add user to post's subscribers
  if (_.has(post, 'userId')) post.addSubscriber(post.userId);
});
// add post's user to subscribers on post insert
// hooks.add('posts.insert.after', function(post) {
//   if (_.has(post, 'userId')) post.addSubscriber(post.userId);
// });

// add notification on comment insert and add user to post's subscribers
hooks.add('comments.insert.after', function(comment) {
  const post = Posts.findOne(comment.postId);
  // notify post's room
  if (post) post.notify('comments.insert', { comment });
  // add user to post's subscribers
  if (post && _.has(comment, 'postId')) post.addSubscriber(comment.userId);
});
