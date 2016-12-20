// at startup
import './lib/core/seed.js';
import './lib/rooms/notify.js';

// register api
import './lib/posts/server/publications.js';
import './lib/posts/methods.js';
import './lib/categories/server/publications.js';
import './lib/categories/methods.js';

// exports
import {
  permit,
  messages,
  notifications
} from './lib/core/settings.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Rooms } from './lib/rooms/rooms.js';

export {
  permit,
  messages,
  notifications,
  Posts,
  Categories,
  Rooms
};
