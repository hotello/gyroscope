// at startup
import './lib/rooms';
import './lib/rooms/server';

// register api
import './lib/posts/server/publications.js';
import './lib/posts/methods.js';
import './lib/posts/queries.js';
import './lib/posts/denormalizers.js';
import './lib/categories/server/publications.js';
import './lib/categories/methods.js';
import './lib/categories/queries.js';
import './lib/comments/server/publications.js';
import './lib/comments/methods.js';
import './lib/comments/queries.js';
import './lib/comments/denormalizers.js';

// exports
import {
  general,
  permit,
  notifications,
  hooks,
  payloads
} from './lib/core/settings.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Rooms } from './lib/rooms/rooms.js';
import { Comments } from './lib/comments/comments.js';
import { attachRooms } from './lib/rooms/attachRooms.js';

export {
  general,
  permit,
  notifications,
  hooks,
  payloads,
  Posts,
  Categories,
  Rooms,
  Comments,
  attachRooms
};
