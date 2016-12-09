import {
  insert,
  update,
  remove
} from '../posts/methods.js';

export class Methods {
  constructor(opts) {
    this._setupPosts(opts)
  }

  _setupPosts(opts) {
    this.posts = {
      insert: new ValidatedMethod(insert(opts)),
      update: new ValidatedMethod(update(opts)),
      remove: new ValidatedMethod(remove(opts))
    };
  }
}
