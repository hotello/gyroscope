import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { hooks } from './settings.js';

export class FlexibleCollection extends Mongo.Collection {
  insert(doc, callback) {
    let result;
    // run before hooks
    doc = hooks.run(`${this._name}.insert.before`, doc);
    // run insert
    result = super.insert(doc, callback);
    // run after hooks
    hooks.run(`${this._name}.insert.after`, doc);
    // return
    return result;
  }

  update(selector, modifier, options, callback) {
    let result;
    let hr;
    // run before hooks
    hr = hooks.run(`${this._name}.update.before`,
      { selector, modifier, options });
    // run insert
    result = super.update(hr.selector, hr.modifier, hr.options);
    // run after hooks
    hooks.run(`${this._name}.update.after`, hr.selector);
    // return
    return result;
  }

  upsert(selector, modifier, options, callback) {
    let result;
    let hr;
    // run before hooks
    hr = hooks.run(`${this._name}.upsert.before`,
      { selector, modifier, options });
    // run insert
    result = super.upsert(hr.selector, hr.modifier, hr.options);
    // run after hooks
    hooks.run(`${this._name}.upsert.after`, hr.selector);
    // return
    return result;
  }

  remove(selector, callback) {
    let result;
    // run before hooks
    selector = hooks.run(`${this._name}.remove.before`, selector);
    // run insert
    result = super.remove(selector, callback);
    // run after hooks
    hooks.run(`${this._name}.remove.after`, selector);
    // return
    return result;
  }
}
