import { Meteor } from 'meteor/meteor';

import { permit, queries } from '../../core/settings.js';
import { ID_FIELD } from '../../core/collections-helpers.js';
import { Posts } from '../posts.js';

Meteor.publish('posts.byQuery', function(queryName, queryParams) {
  let queryFn;
  let query;
  // check arguments passed by the client
  new SimpleSchema({
    queryName: {type: String},
    queryParams: {type: Object, blackbox: true}
  }).validate({ queryName, queryParams });
  // check for permissions
  if (permit.notToDo(this.userId, 'posts.publish.byQuery', { queryName, queryParams })) {
    return this.ready();
  }
  // get the query from the queries dict; if we define the query on the server
  // we can exclude malicious queries, we use a function to integrate dynamic data
  // from the publication.
  queryFn = queries.get(queryName);
  // run query function to get the actual query
  query = queryFn(queryParams);
  // return the found posts
  return Posts.find(query.selector, query.options);
});

Meteor.publish('posts.single', function(postId) {
  new SimpleSchema({
    postId: ID_FIELD
  }).validate({ postId });

  if (permit.notToDo(this.userId, 'posts.publish.single', { postId })) {
    return this.ready();
  }

  return Posts.find(postId);
});
