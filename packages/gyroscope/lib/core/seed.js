import { Factory } from 'meteor/dburles:factory';
import { Posts } from '../posts/posts.js';
import { _ } from 'meteor/underscore';

Meteor.startup(function() {
  if(!Posts.findOne()) {
    _.times(25, function() {
      Factory.create('post');
    });
  }
});
