import { permit } from '../../core/settings.js';
import { Categories } from '../categories.js';

Categories.hooks.add('publish.byQuery', function({ context, name, params }) {
  if (permit.notToDo(context.userId, 'categories.publish.byQuery', { name, params })) {
    return context.ready();
  }
  return { context, params };
});

Categories.hooks.add('publish.single', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'categories.publish.single', { _id })) {
    return context.ready();
  }
  return { context, _id };
});
