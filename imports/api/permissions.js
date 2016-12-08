export class Can {
  constructor(permissions) {
    this.permissions = permissions;
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

const canFn = (userId, data) => {
  return userId ? true : false;
};

export const can = new Can({
  'posts.insert': canFn,
  'posts.update': canFn,
  'posts.delete': canFn,
  'posts.search': () => true
});
