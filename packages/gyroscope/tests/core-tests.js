import { assert } from 'meteor/practicalmeteor:chai';

import { Gyroscope } from '../lib/core/gyroscope.js';

describe('core', function() {
  describe('permit', function() {
    beforeEach(function() {
      Gyroscope.permit.setPermissions({
        //does override defaults?
        'posts.search': () => false,
        'test.fn': () => true
      });
    });

    it('should set permissions', function() {
      assert.doesNotThrow(function() {
        Gyroscope.permit.setPermissions({'test.throws': new Function});
      }, Error);
      assert.throws(function() {
        Gyroscope.permit.setPermissions(null);
      }, Error);
      assert.throws(function() {
        Gyroscope.permit.setPermissions({'test.throws': true});
      }, Error);
    });

    it('should get permissions', function() {
      assert.isFalse(Gyroscope.permit.toDo(null, 'posts.search'));
      assert.isTrue(Gyroscope.permit.notToDo(null, 'posts.search'));
      assert.isTrue(Gyroscope.permit.toDo(null, 'test.fn'));

      assert.throws(function() {
        Gyroscope.permit.toDo('false_id', 'test.fn');
      }, Error);
      assert.throws(function() {
        Gyroscope.permit.toDo(null, 'test.notExising');
      }, Error);
    });
  });

  describe('messages', function() {
    beforeEach(function() {
      Gyroscope.messages.setMessages({
        'test.message': 'test'
      });
    });
    it('should set messages', function() {
      assert.throws(function() {
        Gyroscope.messages.setMessages(null);
      }, Error);
      assert.throws(function() {
        Gyroscope.messages.setMessages({'test.message': false});
      }, Error);
      assert.equal(Gyroscope.messages.messages['test.message'], 'test');
    });

    it('should get messages', function() {
      assert.equal(Gyroscope.messages.get('test.message'), 'test');
      assert.throws(function() {
        Gyroscope.messages.get(false);
      }, Error);
      assert.doesNotThrow(function() {
        Gyroscope.messages.get('test.notExising');
      }, Error);
    });
  });
});
