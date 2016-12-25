import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import faker from 'faker';

import { Posts } from '../lib/posts/posts.js';
import { Categories } from '../lib/categories/categories.js';
import { Comments } from '../lib/comments/comments.js';
import { Rooms } from '../lib/rooms/rooms.js';

// define factory generators for posts
Factory.define('post', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs(),
  userId: () => Random.id(),
  categories: () => [Random.id()]
});
Factory.define('post.fromForm', Posts, {
  title: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraphs(),
  categories: () => [Random.id()]
});

// define factory generators for categories
Factory.define('category', Categories, {
  name: () => faker.lorem.words()
});

// define factory generators for comments
Factory.define('comment', Comments, {
  body: () => faker.lorem.sentence(),
  userId: () => Random.id(),
  postId: () => Random.id()
});
Factory.define('comment.fromForm', Comments, {
  body: () => faker.lorem.sentence(),
  postId: () => Random.id()
});

// define factory generators for tests
Factory.define('room', Rooms, {
  ownerId: () => Random.id(),
  users: () => [Random.id()],
  subscribers: () => [Random.id()]
});
