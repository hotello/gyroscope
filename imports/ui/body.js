import './body.html';

import { gyroscope } from '../startup/setup-gyroscope.js';

Template.body.helpers({
  postsIndex: () => gyroscope._indexes.posts
});
