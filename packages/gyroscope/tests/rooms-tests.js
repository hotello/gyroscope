import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { notifications } from '../lib/core/settings.js';
import { Rooms } from '../lib/rooms/rooms.js';

describe('rooms', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Rooms.remove({});
      });

      it('should insert room', function() {
        const room = Factory.create('room');
        assert.isObject(Rooms.findOne());
      });

      it('should alter rooms', function() {
        const room = Factory.create('room');
        // check update
        assert.equal(Rooms.update(room._id, {$set: Factory.tree('room')}), 1);
      });

      it('should add a user to a room', function() {
        const room = Factory.create('room');
        const id = Random.id();
        assert.equal(room.addUser(id), 1);
        assert.isDefined(Rooms.findOne({users: {$in: [id]}}));
      });

      it('should remove a user from a room', function() {
        const room = Factory.create('room');
        const id = room.users[0];
        assert.equal(room.removeUser(id), 1);
        assert.isUndefined(Rooms.findOne({users: {$in: [id]}}));
      });

      it('should add a subscriber to a room', function() {
        const room = Factory.create('room');
        const id = Random.id();
        assert.equal(room.addSubscriber(id), 1);
        assert.isDefined(Rooms.findOne({users: {$in: [id]}, subscribers: {$in: [id]}}));
      });

      it('should remove a subscriber from a room', function() {
        const room = Factory.create('room');
        const id = room.subscribers[0];
        assert.equal(room.removeSubscriber(id), 1);
        assert.isUndefined(Rooms.findOne({users: {$in: [id]}, subscribers: {$in: [id]}}));
      });
    }
  });

  describe('notifications', function() {
    if (Meteor.isServer) {
      before(function() {
        notifications.set({
          'test.notification': new Function()
        });
      });
      beforeEach(function() {
        Rooms.remove({});
      });

      it('should notify users in a room', function() {
        const room = Factory.create('room');
        assert.isArray(room.notify('test.notification', {}));
      });
    }
  });
});
