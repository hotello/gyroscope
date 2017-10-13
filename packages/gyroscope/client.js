// on startup
import './lib/rooms';

// register api
import './lib/posts/methods.js';
import './lib/posts/queries.js';
import './lib/posts/denormalizers.js';
import './lib/categories/methods.js';
import './lib/categories/queries.js';
import './lib/comments/methods.js';
import './lib/comments/queries.js';
import './lib/comments/denormalizers.js';
import './lib/rooms/queries.js';
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
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Comments } from './lib/comments/comments.js';
import { Notifications } from './lib/rooms/notifications.js';
import { attachRooms } from './lib/rooms/attachRooms.js';

export {
  general,
  permit,
  queries,
  hooks,
  extendSchema,
  Posts,
  Categories,
  Comments,
  Notifications,
  attachRooms
};
