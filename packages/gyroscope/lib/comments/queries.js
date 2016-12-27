import { Comments } from './comments.js';

Comments.queries.set({
  'comments.byPost': function(params) {
    const MAX_COMMENTS = 1000;
    return {
      selector: {postId: params.postId},
      options: {
        sort: {createdAt: -1},
        limit: Math.min(params.limit, MAX_COMMENTS)
      }
    };
  }
});
