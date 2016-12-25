import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit, queries } from '../settings.js';

export const generatePublishByQuery = function({ permissionName, collection }) {
  return function(queryName, queryParams) {
    let queryFn;
    let query;

    // check arguments passed by the client
    new SimpleSchema({
      queryName: {type: String},
      queryParams: {type: Object, blackbox: true}
    }).validate({ queryName, queryParams });
    // check for permissions
    if (permit.notToDo(this.userId, permissionName, { queryName, queryParams })) {
      return this.ready();
    }
    // get the query from the queries dict; if we define the query on the server
    // we can exclude malicious queries, we use a function to integrate dynamic data
    // from the publication.
    queryFn = queries.get(queryName);
    // run query function to get the actual query
    query = queryFn(queryParams);
    // return the found cursor
    return collection.find(query.selector, query.options);
  };
};
