import { permit } from '../../core/settings.js';
import { Categories } from '../categories.js';

Categories.hooks.add('categories.publish.byQuery', function({ context, queryParams }) {
  if (permit.notToDo(context.userId, 'categories.publish.byQuery', { queryParams })) {
    return context.ready();
  }

  return queryParams;
});

Categories.hooks.add('categories.publish.single', function({ context, documentId }) {
  if (permit.notToDo(context.userId, 'categories.publish.single', { documentId })) {
    return context.ready();
  }

  return documentId;
});
