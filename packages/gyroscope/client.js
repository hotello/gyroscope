// register api
import './lib/posts/methods.js';
import './lib/posts/queries.js';
import './lib/posts/denormalizers.js';
import './lib/categories/methods.js';
import './lib/categories/queries.js';
import './lib/comments/methods.js';
import './lib/comments/queries.js';
import './lib/comments/denormalizers.js';
// register components
import './lib/posts/client/posts.js';
import './lib/categories/client/categories.js';
import './lib/comments/client/comments.js';

// exports
import {
  general,
  permit,
  queries,
  hooks
} from './lib/core/settings.js';
import { extendSchema } from './lib/core/collections-helpers.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Comments } from './lib/comments/comments.js';

export {
  general,
  permit,
  queries,
  hooks,
  extendSchema,
  Posts,
  Categories,
  Comments
};
