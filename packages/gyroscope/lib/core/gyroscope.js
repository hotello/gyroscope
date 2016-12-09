import { Can } from './permissions.js';
import { Methods } from './methods.js';
import { Search } from './search.js';

/**
 * Gyroscope is the exported object, use it for config
 * @class
 */
export class Gyroscope {
  /**
   * Sets up in a sequence all properties and things
   * @param {Object} opts Options for configuration
   * @param {Object} opts.permissions Object with with names as keys and functions
   * as values, these functions must return a Boolean, are passed a userId and
   * eventual data
   */
  constructor(opts) {
    this.opts = opts;

    this._setupCan(opts);
    this._setupMethods(opts);
    this._setupSearch(opts);
  }

  _setupCan() {
    const opts = {permissions: this.opts.permissions};

    this._can = new Can(opts);
  }

  _setupMethods() {
    const opts = {can: this._can};

    this._methods = new Methods(opts);
  }

  _setupSearch() {
    const opts = {can: this._can};

    this._indexes = new Search(opts);
  }
}
