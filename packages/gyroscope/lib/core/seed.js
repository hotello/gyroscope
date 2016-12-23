import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';

import { Posts } from '../posts/posts.js';
import { Categories } from '../categories/categories.js';
import { Comments } from '../comments/comments.js';

Meteor.startup(function() {
  if(!Posts.findOne()) {
    _.times(25, function() {
      Factory.create('post');
    });
  }

  if(!Categories.findOne()) {
    _.times(10, function() {
      Factory.create('category');
    });
  }

  if(!Comments.findOne()) {
    _.times(10, function() {
      Factory.create('comment');
    });
  }
});
