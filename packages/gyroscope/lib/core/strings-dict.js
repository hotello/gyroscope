import { _ } from 'meteor/underscore';

import { Dict } from './dict.js';

export class StringsDict extends Dict {
  // check if a value is a string
  _checkValue(value) {
    if (!_.isString(value)) {
      throw new Error('stringsDict._checkValue: must provide only strings as values.');
    }
  }
}
