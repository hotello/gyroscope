import { Rooms } from './rooms.js';
import { attachHelpers } from './attachHelpers.js';
import { attachMethods } from './attachMethods.js';

export const attachRooms = function(collection) {
  // add helpers
  attachHelpers(collection);
  // add methods
  attachMethods(collection);
};
