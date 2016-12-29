import { Posts } from '../posts/posts.js';
import { Categories } from '../categories/categories.js';
import { Rooms } from './rooms.js';

export const withRoom = {
  // get document's room or create it
  room() {
    const room = Rooms.findOne({ownerId: this._id});
    const newRoomId = room ? null : Rooms.insert({ownerId: this._id});
    // return a new room or the existing one
    return newRoomId ? Rooms.findOne(newRoomId) : room;
  },
  // add subscriber to the room
  addSubscriber(userId) {
    return this.room().addSubscriber(userId);
  },
  // remove subscriber and user from room
  removeUser(userId) {
    return this.room().removeUser(userId);
  },
  // notify subscribers in room
  notify(notification, data) {
    const room = this.room();
    // do not notify if room has no subscribers
    if (!_.has(room, 'subscribers') || room.subscribers.length === 0) return false;
    // run notification
    return room.notify(notification, data);
  }
};

// add rooms to categories
Categories.helpers(withRoom);
// add rooms to posts
Posts.helpers(withRoom);
