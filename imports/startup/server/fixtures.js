import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Factory } from 'meteor/dburles:factory';

import { Posts } from '../../api/posts/posts.js';

Meteor.startup(function() {
  if (!Posts.findOne()) {
    _.times(25, function() {
      Factory.create('post');
    });
  }
});
