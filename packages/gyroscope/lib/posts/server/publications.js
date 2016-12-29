import { permit } from '../../core/settings.js';
import { Posts } from '../posts.js';

Posts.hooks.add('posts.publish.byQuery', function({ context, name, params }) {
  if (permit.notToDo(context.userId, 'posts.publish.byQuery', { name, params })) {
    return context.ready();
  }

  return { context, name, params };
});

Posts.hooks.add('posts.publish.single', function({ context, _id }) {
  if (permit.notToDo(context.userId, 'posts.publish.single', { _id })) {
    return context.ready();
  }

  return { context, _id };
});
