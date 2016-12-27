import { Posts } from './posts.js';

Posts.queries.set({
  'posts.byCategory': function(params) {
    const MAX_TODOS = 1000;
    return {
      selector: {categories: {$in: [params.categoryId]}},
      options: {
        sort: {title: 1},
        limit: Math.min(params.limit, MAX_TODOS)
      }
    };
  }
});
