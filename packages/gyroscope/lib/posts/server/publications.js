import { permit } from '../../core/settings.js';
import { Posts } from '../posts.js';

Posts.hooks.add('posts.publish.byQuery', function({ context, queryParams }) {
  if (permit.notToDo(context.userId, 'posts.publish.byQuery', { queryParams })) {
    return context.ready();
  }

  return queryParams;
});

Posts.hooks.add('posts.publish.single', function({ context, documentId }) {
  if (permit.notToDo(context.userId, 'posts.publish.single', { documentId })) {
    return context.ready();
  }

  return documentId;
});
