import { _ } from 'meteor/underscore';

import { ID_FIELD_OPT } from './collections-helpers.js';

export class Permit {
  /**
   * Constructs with permissions object
   * @param {[Object} permissions Object with a dict of actions and functions
   */
  constructor(permissions) {
    this.permissions = {};

    this._setPermissions(permissions);
  }

  /**
   * Tells if user of userId can perform an action, with given data
   * @param {String} user _id string of user
   * @param {String} action name of the action to perform
   * @param {Object} data eventual data to use in the permission functions
   * @return {Boolean} result given by the permission function
   */
  toDo(userId, action, data) {
    return this._toDo(userId, action, data);
  }

  /**
   * Tells if user of userId cannot perform an action, with given data
   * @param {String} user _id string of user
   * @param {String} action name of the action to perform
   * @param {Object} data eventual data to use in the permission functions
   * @return {Boolean} result given by the permission function, nagated
   */
  notToDo(userId, action, data) {
    return !this._toDo(userId, action, data);
  }

  /**
   * Merges a dict of names and functions with already set permissions
   * @params {Object} permissions dict of names and functions
   */
  setPermissions(permissions) {
    this._setPermissions(permissions);
  }

  // merge a permissions dict with the internal one
  _setPermissions(permissions) {
    if (_.isObject(permissions)) {
      _.each(_.keys(permissions), (el) => {
        this._setPermission(permissions[el], el);
      });
    } else {
      throw new Error('permit.setPermissions: must provide an object.');
    }
  }

  // set permission in the permissions dict
  _setPermission(fn, key) {
    if (!_.isFunction(fn)) throw new Error('permit.setPermissions: must provide a function');

    this.permissions[key] = fn;
  }

  // run permissions dict function
  _toDo(userId, action, data) {
    new SimpleSchema({
      userId: ID_FIELD_OPT,
      action: {type: String},
      data: {type: Object, optional: true, blackbox: true}
    }).validate({userId, action, data});

    const fn = this._get(action);

    if (!fn) throw Error('permit.toDo/notToDo: action not found in permissions.')

    return fn(userId, data);
  }

  // Get an action from the permissions dict
  _get(action) {
    return this.permissions[action];
  }
}
