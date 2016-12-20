import { Categories } from '../categories/categories.js';
import { Rooms } from './rooms.js';

Categories.helpers({
  // get category's room or create it
  room() {
    const room = Rooms.findOne({ownerId: this._id});
    const newRoomId = room ? null : Rooms.insert({ownerId: this._id});
    return newRoomId ? Rooms.findOne(newRoomId) : room;
  },
  // add subscriber to the category's room
  addSubscriber(userId) {
    return this.room().addSubscriber(userId);
  },
  // remove subscriber and user from category's room
  removeSubscriber(userId) {
    return this.room().removeUser(userId);
  },
  // notify subscribers in category's room
  notify(notification, data) {
    return this.room().notify(notification, data);
  }
});
