import { assert } from 'meteor/practicalmeteor:chai';
import { _ } from 'meteor/underscore';

import { Dict } from '../lib/core/dict.js';
import { StringsDict } from '../lib/core/strings-dict.js';
import { FunctionsDict } from '../lib/core/functions-dict.js';
import { Permit } from '../lib/core/permit.js';
import { Hooks } from '../lib/core/hooks.js';

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

  describe('hooks', function() {
    const hooks = new Hooks({});

    beforeEach(function() {
      hooks.pairs = {};
    });

    it('should accept only arrays of functions', function() {
      assert.doesNotThrow(function() {
        hooks.set({'test.hooks': [new Function]});
      }, Error);
      assert.throws(function() {
        hooks.set({'test.hooks': new Function});
      }, Error);
    });

    it('should setup a group of callbacks', function() {
      hooks._setup('test.hooks');
      assert.isArray(hooks.pairs['test.hooks']);
      assert.equal(hooks.pairs['test.hooks'].length, 0);
    });

    it('should add a callback to an array of callbacks', function() {
      hooks.add('test.hooks', new Function);
      assert.isFunction(hooks.get('test.hooks')[0]);
    });

    it('should run all the callbacks and return', function() {
      const fn = (arg) => arg + 1;
      assert.equal(hooks.run('test.hooks', 'noHooks'), 'noHooks');
      _.times(3, () => { hooks.add('test.hooks', fn); });
      assert.equal(hooks.run('test.hooks', 0), 3);
    });
  });
});
