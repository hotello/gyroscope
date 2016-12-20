// register components
import './lib/posts/client/posts.js';
import './lib/categories/client/categories.js';

// exports
import {
  permit,
  messages
} from './lib/core/settings.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';

export {
  permit,
  messages,
  Posts,
  Categories,
};
