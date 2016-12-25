import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import { ReactiveDict } from 'meteor/reactive-dict';

import { messages, hooks, queries } from '../../core/settings.js';
import { Posts } from '../posts.js';
import { POSTS_METHODS_SCHEMA, insert } from '../methods.js';
import { ID_FIELD } from '../../core/collections-helpers.js';

import './posts.html';

/**
 * Posts_list
 */
Template.Posts_list.helpers({
  postsCollection: () => Posts
});

// /**
//  * Posts_list
//  */
// Template.Posts_list.onCreated(function() {
//   this.getQuery = () => Template.currentData().query;
//   this.getPosts = (queryInput) => {
//     const queryFn = queries.get(queryInput.name);
//     const query = queryFn(queryInput.params);
//     return Posts.find(query.selector, query.options);
//   };
//   // set state
//   this.state = new ReactiveDict();
//   this.state.setDefault({requestedPosts: 1});
//   // autorun
//   this.autorun(() => {
//     new SimpleSchema({
//       query: {type: Object},
//       'query.name': {type: String},
//       'query.params': {type: Object, blackbox: true}
//     }).validate(Template.currentData());
//     const name = this.getQuery().name;
//     const params = this.getQuery().params;
//     // set the limit from the state for pagination
//     params.limit = this.state.get('requestedPosts');
//     // subscribe to posts passing the query name
//     this.subscribe('posts.byQuery', name, params);
//   });
// });
// Template.Posts_list.helpers({
//   postsListArgs(query) {
//     const instance = Template.instance();
//     return {
//       posts: instance.getPosts(query),
//       noResults: instance.subscriptionsReady() && instance.getPosts(query).count() === 0,
//       loading: !instance.subscriptionsReady(),
//       loadMore() {
//         const current = instance.state.get('requestedPosts');
//         instance.state.set('requestedPosts', current + 1);
//       }
//     };
//   }
// });

/**
 * Posts_item
 */
Template.Posts_item.onCreated(function() {
  this.getPostId = () => Template.currentData().postId;
  this.autorun(() => {
    new SimpleSchema({
      postId: ID_FIELD
    }).validate(Template.currentData());
    // subscribe by post id
    this.subscribe('posts.single', this.getPostId());
  });
});
Template.Posts_item.helpers({
  post(postId) {
    return Posts.findOne(postId);
  }
});

/**
 * Posts_form_insert
 */
Template.Posts_form_insert.helpers({
  schema() {
    return POSTS_METHODS_SCHEMA;
  },
  prefill(categoryId) {
    return categoryId ? {categories: categoryId} : {};
  }
});
AutoForm.addHooks('Posts_form_insert', {
  onSuccess: function(formType, result) {
    hooks.run('posts.forms.insert.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('posts.forms.insert.onError', error);
  }
});

/**
 * Posts_form_update
 */
Template.Posts_form_update.onCreated(function() {
  this.getPostId = () => Template.currentData().postId;
  this.autorun(() => {
    new SimpleSchema({
      postId: ID_FIELD
    }).validate(Template.currentData());
    this.subscribe('posts.single', this.getPostId());
  });
});
Template.Posts_form_update.helpers({
  schema() {
    return POSTS_METHODS_SCHEMA;
  },
  post() {
    const instance = Template.instance();
    return Posts.findOne(instance.getPostId());
  }
});
AutoForm.addHooks('Posts_form_update', {
  onSuccess: function(formType, result) {
    hooks.run('posts.forms.update.onSuccess', result);
  },
  onError: function(formType, error) {
    hooks.run('posts.forms.update.onError', error);
  }
});
