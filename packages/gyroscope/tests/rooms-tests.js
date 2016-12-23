import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { notifications } from '../lib/core/settings.js';
import { Rooms } from '../lib/rooms/rooms.js';
import { Categories } from '../lib/categories/categories.js';

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

      describe('hooks', function() {
        it('should add user to subscribers on post insert', function() {
          const post = Factory.create('post');
          // commenter should be added to post's subscribers
          assert.include(post.room().subscribers, post.userId);
        });

        it('should insert comment on existing post, adding user to subscribers', function() {
          const post = Factory.create('post');
          const comment = Factory.create('comment', {postId: post._id});
          // commenter should be added to post's subscribers
          assert.include(post.room().subscribers, comment.userId);
        });
      });
    }
  });

  /**
   * These association tests refer to Categories, but any collection would work.
   */
  describe('associations', function() {
    if (Meteor.isServer) {
      before(function() {
        notifications.set({
          'test.notification': new Function()
        });
      });
      beforeEach(function() {
        Rooms.remove({});
        Categories.remove({});
      });

      it('should get a document\'s room and, if not existing, create it', function () {
        const category = Factory.create('category');
        // should create and get the same room
        assert.deepEqual(category.room(), category.room());
      });

      it('should add a subscriber to a document\'s room', function() {
        const category = Factory.create('category');
        assert.equal(category.addSubscriber(Random.id()), 1);
      });

      it('should remove a user from a document\'s room', function() {
        const category = Factory.create('category');
        assert.equal(category.removeUser(Random.id()), 1);
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
        Categories.remove({});
      });

      it('should notify subscribers in a room', function() {
        const room = Factory.create('room');
        assert.isArray(room.notify('test.notification', {}));
      });

      it('should notify subscribers of a category', function() {
        const category = Factory.create('category');
        // notifications need subscribers
        category.room().addSubscriber(Random.id());
        assert.isArray(category.notify('test.notification', {}));
      });

      it('should notify subscribers of a post', function() {
        const post = Factory.create('post');
        // notifications need subscribers
        post.room().addSubscriber(Random.id());
        assert.isArray(post.notify('test.notification', {}));
      });
    }
  });
});