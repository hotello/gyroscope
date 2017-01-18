import { Comments } from './comments.js';
import { Posts } from '../posts/posts.js';

Comments.hooks.add('insert.after', function({ result, doc }) {
  // increment comment count on posts
  if (result && doc.postId) {
    Posts.update(doc.postId, {$inc: {commentCount: 1}});
  }
  return { result, doc };
});

Comments.hooks.add('remove.before', function(commentId) {
  const comment = Comments.findOne(commentId);
  // decrement comment count on posts
  if (comment) {
    Posts.update(comment.postId, {$inc: {commentCount: -1}});
  }
  return commentId;
});
