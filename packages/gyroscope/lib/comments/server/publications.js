import { permit } from '../../core/settings.js';
import { Comments } from '../comments.js';

Comments.hooks.add('publish.byQuery', function({ context, name, params }) {
  if (permit.notToDo(context.userId, 'comments.publish.byQuery', { name, params })) {
    return context.ready();
  }
  return { context, name, params };
});

Comments.hooks.add('publish.single', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'comments.publish.single', { _id })) {
    return context.ready();
  }
  return { context, _id };
});
