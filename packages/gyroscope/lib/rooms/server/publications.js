import { permit } from '../../core/settings.js';
import { Notifications } from '../notifications.js';

Notifications.hooks.add('publish.byQuery', function({ context, name, params }) {
  if (permit.notToDo(context.userId, 'notifications.publish.byQuery', { name, params })) {
    return context.ready();
  }
  return { context, name, params };
});

Notifications.hooks.add('publish.single', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'notifications.publish.single', { _id })) {
    return context.ready();
  }
  return { context, _id };
});
