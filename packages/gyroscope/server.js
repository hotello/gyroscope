// at startup
import './lib/core/seed.js';
import './lib/rooms/notify.js';
import './lib/rooms/notification-helpers.js';
import './lib/rooms/hooks.js';

// register api
import './lib/posts/server/publications.js';
import './lib/posts/methods.js';
import './lib/categories/server/publications.js';
import './lib/categories/methods.js';
import './lib/comments/server/publications.js';
import './lib/comments/methods.js';

// exports
import {
  general,
  permit,
  messages,
  notifications
} from './lib/core/settings.js';
import { Posts } from './lib/posts/posts.js';
import { Categories } from './lib/categories/categories.js';
import { Rooms } from './lib/rooms/rooms.js';
import { Comments } from './lib/comments/comments.js';
import { sendEmail } from './lib/rooms/send-email-notification.js';

export {
  general,
  permit,
  messages,
  notifications,
  Posts,
  Categories,
  Rooms,
  Comments,
  sendEmail
};
