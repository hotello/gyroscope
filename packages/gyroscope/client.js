// register components
import './lib/posts/client/posts.js';
import './lib/categories/client/categories.js';
import './lib/comments/client/comments.js';

// exports
import {
  permit,
  messages
} from './lib/core/settings.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Comments } from './lib/comments/comments.js';

export {
  permit,
  messages,
  Posts,
  Categories,
  Comments
};
