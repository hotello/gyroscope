import { Gyroscope } from './gyroscope.js';

export class Can {
  constructor(opts) {
    this.permissions = opts.permissions;
  }

  can(userId, action, data) {
    return this._can(userId, action, data);
  }

  cant(userId, action, data) {
    return !this._can(userId, action, data);
  }

  _can(userId, action, data) {
    const fn = this._get(action);

    return fn(userId, data);
  }

  _get(action) {
    return this.permissions[action];
  }
}
