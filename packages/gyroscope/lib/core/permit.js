import { _ } from 'meteor/underscore';

import { FunctionsDict } from './functions-dict.js';
import { ID_FIELD_OPT } from './collections-helpers.js';

export class Permit extends FunctionsDict {
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

  // run permissions dict function
  _toDo(userId, action, data) {
    new SimpleSchema({
      userId: ID_FIELD_OPT,
      action: {type: String},
      data: {type: Object, optional: true, blackbox: true}
    }).validate({userId, action, data});

    const fn = this.get(action);

    return fn(userId, data);
  }
}
