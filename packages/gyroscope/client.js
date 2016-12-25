// register components
import './lib/core/client/list.js';
import './lib/posts/client/posts.js';
import './lib/categories/client/categories.js';
import './lib/comments/client/comments.js';

// exports
import {
  general,
  permit,
  queries
} from './lib/core/settings.js';
import { extendSchema } from './lib/core/collections-helpers.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Comments } from './lib/comments/comments.js';

export {
  general,
  permit,
  queries,
  extendSchema,
  Posts,
  Categories,
  Comments
};
