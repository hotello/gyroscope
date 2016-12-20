import { assert } from 'meteor/practicalmeteor:chai';

import { Dict } from '../lib/core/dict.js';
import { StringsDict } from '../lib/core/strings-dict.js';
import { FunctionsDict } from '../lib/core/functions-dict.js';
import { Permit } from '../lib/core/permit.js';

describe('core', function() {
  describe('dict', function() {
    const dict = new Dict({
      'test.pair': true
    });

    it('should set pairs', function() {
      assert.throws(function() {
        dict.set(null);
      }, Error);
      assert.equal(dict.pairs['test.pair'], true);
    });

    it('should get pairs', function() {
      assert.throws(function() {
        dict.get(false);
      }, Error);
      assert.throws(function() {
        dict.get('test.notExising');
      }, Error);
      assert.equal(dict.get('test.pair'), true);
    });
  });

  describe('strings dict', function() {
    it('should set only strings', function() {
      const stringsDict = new StringsDict({});
      assert.doesNotThrow(function() {
        stringsDict.set({
          'test.string': new String()
        });
      }, Error);
      assert.throws(function() {
        stringsDict.set({'test.string': false});
      }, Error);
      assert.isString(stringsDict.pairs['test.string']);
    });
  });

  describe('functions dict', function() {
    it('should set only functions', function() {
      const functionsDict = new FunctionsDict({});
      assert.doesNotThrow(function() {
        functionsDict.set({
          'test.function': new Function()
        });
      }, Error);
      assert.throws(function() {
        functionsDict.set({'test.function': false});
      }, Error);
      assert.isFunction(functionsDict.pairs['test.function']);
    });
  });

  describe('permit', function() {
    const permit = new Permit({
      'test.fn': () => true
    });

    it('should check permissions', function() {
      assert.isTrue(permit.toDo(null, 'test.fn'));
      assert.isFalse(permit.notToDo(null, 'test.fn'));
      assert.throws(function() {
        permit.toDo('false_id', 'test.fn');
      }, Error);
    });
  });
});
