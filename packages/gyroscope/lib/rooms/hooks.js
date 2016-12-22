import { Meteor } from 'meteor/meteor';

import { hooks } from '../core/settings.js';
import { Categories } from '../categories/categories.js';

// add notification on post insert
hooks.add('posts.insert.after', function(post) {
  // notify all users subscribed to post's categories
  if (Meteor.isServer && _.has(post, 'categories')) {
    _.each(post.categories, (categoryId) => {
      const category = Categories.findOne(categoryId);
      if (category) category.notify('posts.insert', { post });
    });
  }
});
