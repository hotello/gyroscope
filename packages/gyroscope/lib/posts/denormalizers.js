import { hooks } from '../core/settings.js';
import { toArray } from '../core/collections-helpers.js';

hooks.add('posts.insert.before', (post) => {
  // transform categories to array
  post.categories = toArray(post.categories);
  // always return on hooks
  return post;
});

hooks.add('posts.update.before', (args) => {
  const modifier = args.modifier;
  // transform categories to array with modifier
  if (_.has(modifier, '$set') && _.has(modifier.$set, 'categories')) {
    modifier.$set.categories = toArray(modifier.$set.categories);
  }
  args.modifier = modifier;
  // always return on hooks
  return args;
});
