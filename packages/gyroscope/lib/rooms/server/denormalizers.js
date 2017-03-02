import { _ } from 'meteor/underscore';

import { hooks } from '../../core/settings.js';
import { Categories } from '../../categories/categories.js';
import { Posts } from '../../posts/posts.js';
import { Comments } from '../../comments/comments.js';
import { Rooms } from '../../rooms/rooms.js';

const notifyCategoryOnPost = function(post) {
  if (post && _.has(post, 'categories')) {
    _.each(post.categories, (categoryId) => {
      const room = Rooms.findOne({ownerId: categoryId});
      if (room) {
        room.notify('posts.insert', {
          postId: post._id,
          categoryId,
          roomId: room._id,
          without: [post.userId],
          senderId: post.userId
        });
      }
    });
  }
};
const notifyPostOnComment = function(comment, post) {
  const room = Rooms.findOne({ownerId: comment.postId});
  if (room) {
    room.notify('comments.insert', {
      commentId: comment._id,
      postId: post._id,
      roomId: room._id,
      without: [comment.userId],
      senderId: comment.userId
    });
  }
};

// add post's user to subscribers on post insert
Posts.hooks.add('insert.after', function({ result, doc }) {
  if (!result) return { result, doc };
  // find post
  const post = Posts.findOne(result);
  // notify all users subscribed to post's categories
  notifyCategoryOnPost(post);
  // add subscriber
  post.addSubscriber(doc.userId);
  // remember to always return on hooks
  return { result, doc };
});

// add notification on comment insert and add user to post's subscribers
Comments.hooks.add('insert.after', function({ result, doc }) {
  if (!result) return { result, doc };
  // find comment and post
  const comment = Comments.findOne(result);
  const post = Posts.findOne(comment.postId);
  // notify post's room
  notifyPostOnComment(comment, post);
  // add user to post's subscribers
  if (post) post.addSubscriber(comment.userId);
  // remember to always return on hooks
  return { result, doc };
});
