import { Meteor } from 'meteor/meteor';
import { Posts } from '../posts/posts.js';
import { Categories } from '../categories/categories.js';
import { attachRooms } from './attachRooms.js';

// add rooms to categories
attachRooms(Categories);
// add rooms to posts
attachRooms(Posts);
