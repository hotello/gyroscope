import { postsIndex } from '../posts/posts.js';

/**
 * A class that sets up search indexes
 */
export class Search {
  constructor(opts) {
    this._setupPosts(opts);
  }

  _setupPosts(opts) {
    this.posts = postsIndex(opts);
  }
}
