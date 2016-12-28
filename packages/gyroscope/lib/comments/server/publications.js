import { permit } from '../../core/settings.js';
import { Comments } from '../comments.js';

Comments.hooks.add('comments.publish.byQuery', function({ context, queryParams }) {
  if (permit.notToDo(context.userId, 'comments.publish.byQuery', { queryParams })) {
    return context.ready();
  }

  return queryParams;
});

Comments.hooks.add('comments.publish.single', function({ context, documentId }) {
  if (permit.notToDo(context.userId, 'comments.publish.single', { documentId })) {
    return context.ready();
  }

  return documentId;
});
