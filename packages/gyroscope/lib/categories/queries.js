import { Categories } from './categories.js';

Categories.queries.set({
  'categories.all': function(params) {
    const MAX_CATEGORIES = 1000;
    return {
      selector: {},
      options: {
        sort: {name: 1},
        limit: Math.min(params.limit, MAX_CATEGORIES)
      }
    };
  }
});
