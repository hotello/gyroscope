import { assert } from 'meteor/practicalmeteor:chai';

import { Permit } from '../lib/core/permit.js';

describe('core', function() {
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
