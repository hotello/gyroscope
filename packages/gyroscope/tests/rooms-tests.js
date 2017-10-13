import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import {
  notifications,
  Rooms,
  Posts,
  Categories,
  Notifications
 } from 'meteor/hotello:gyroscope';

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

      it('should add a user to a room, without duplicates', function() {
        const room = Factory.create('room');
        const id = Random.id();
        assert.equal(room.addUser(id), 1);
        assert.isDefined(Rooms.findOne({users: {$in: [id]}}));
        room.addUser(id); // try to add the same id again
        assert.lengthOf(Rooms.findOne(room._id).users, 2);
      });

      it('should remove a user from a room', function() {
        const room = Factory.create('room');
        const id = room.users[0];
        assert.equal(room.removeUser(id), 1);
        assert.isUndefined(Rooms.findOne({users: {$in: [id]}}));
      });

      it('should add a subscriber to a room, without duplicates', function() {
        const room = Factory.create('room');
        const id = Random.id();
        assert.equal(room.addSubscriber(id), 1);
        assert.isDefined(Rooms.findOne({users: {$in: [id]}, subscribers: {$in: [id]}}));
        room.addSubscriber(id); // try to add the same id again
        assert.lengthOf(Rooms.findOne(room._id).subscribers, 2);
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
    it('should get a document\'s room and, if not existing, create it', function () {
      const category = Factory.create('category');
      // should create and get the same room
      if (Meteor.isServer) {
        assert.deepEqual(category.room(), category.room());
      } else {
        assert.isUndefined(category.room());
      }
    });

    if (Meteor.isServer) {
      before(function() {
        notifications.set({
          'test.notification': new Function()
        });
      });
      beforeEach(function() {
        Rooms.remove({});
        Categories.remove({});
        Meteor.users.remove({});
      });

      it('should add subscriptions to users, no duplicates, and remove', function() {
        const user = Factory.create('user');
        const categoryOne = Factory.create('category');
        const categoryTwo = Factory.create('category');
        categoryOne.addSubscriber(user._id);
        categoryTwo.addSubscriber(user._id);
        categoryTwo.addSubscriber(user._id);
        assert.lengthOf(Meteor.users.findOne(user._id).subscriptions, 2);
        categoryOne.removeSubscriber(user._id);
        categoryTwo.removeSubscriber(user._id);
        assert.lengthOf(Meteor.users.findOne(user._id).subscriptions, 0);
      });

      it('should add a user to a document\'s room', function() {
        const category = Factory.create('category');
        const user = Factory.create('user');
        assert.equal(category.addUser(user._id), 1);
        // check updated room
        const updatedCategory = Categories.findOne(category._id);
        assert.notInclude(updatedCategory.room().subscribers, user._id);
        assert.include(updatedCategory.room().users, user._id);
        assert.notInclude(Meteor.users.findOne(user._id).subscriptions, category._id);
      });

      it('should add a subscriber to a document\'s room', function() {
        const category = Factory.create('category');
        const user = Factory.create('user');
        assert.equal(category.addSubscriber(user._id), 1);
        // check updated room
        const updatedCategory = Categories.findOne(category._id);
        assert.include(updatedCategory.room().subscribers, user._id);
        assert.include(updatedCategory.room().users, user._id);
        assert.include(Meteor.users.findOne(user._id).subscriptions, category._id);
      });

      it('should remove a subscriber to a document\'s room', function() {
        const category = Factory.create('category');
        const user = Factory.create('user');
        category.addSubscriber(user._id);
        assert.equal(category.removeSubscriber(user._id), 1);
        // check updated room
        const updatedCategory = Categories.findOne(category._id);
        assert.notInclude(updatedCategory.room().subscribers, user._id);
        assert.include(updatedCategory.room().users, user._id);
        assert.notInclude(Meteor.users.findOne(user._id).subscriptions, category._id);
      });

      it('should remove a user from a document\'s room', function() {
        const category = Factory.create('category');
        const user = Factory.create('user');
        category.addSubscriber(user._id);
        assert.equal(category.removeUser(user._id), 1);
        // check updated room
        const updatedCategory = Categories.findOne(category._id);
        assert.notInclude(updatedCategory.room().subscribers, user._id);
        assert.notInclude(updatedCategory.room().users, user._id);
        assert.notInclude(Meteor.users.findOne(user._id).subscriptions, category._id);
      });
    }
  });

  describe('methods', function() {
    const userId = Random.id();
    const methodInvocation = { userId };
    const methods = Categories.methods;

    it('should add subscriber', function() {
      const category = Factory.create('category');
      // add subscriber
      const result = methods.addSubscriber._execute(
        methodInvocation,
        { documentId: category._id }
      );
      if (Meteor.isClient) {
        assert.isFalse(result);
      } else {
        assert.equal(result, 1);
        assert.include(Categories.findOne(category._id).room().subscribers, userId);
      }
    });

    it('should remove subscriber', function() {
      const category = Factory.create('category');
      if (Meteor.isServer) {
        category.addSubscriber(userId);
      }
      // remove subscriber
      const result = methods.removeSubscriber._execute(
        methodInvocation,
        { documentId: category._id }
      );
      if (Meteor.isClient) {
        assert.isFalse(result);
      } else {
        assert.equal(result, 1);
        assert.notInclude(Categories.findOne(category._id).room().subscribers, userId);
      }
    });

    it('should remove user', function() {
      const category = Factory.create('category');
      if (Meteor.isServer) {
        category.addSubscriber(userId);
      }
      // remove subscriber
      const result = methods.removeUser._execute(
        methodInvocation,
        { documentId: category._id }
      );
      if (Meteor.isClient) {
        assert.isFalse(result);
      } else {
        assert.equal(result, 1);
        assert.notInclude(Categories.findOne(category._id).room().users, userId);
      }
    });
  });

  describe('notifications', function() {
    if (Meteor.isServer) {
      before(function() {
        notifications.set({
          'test.notification': function(data) {
            assert.property(data, 'sender');
            assert.property(data, 'recipientId');
            assert.property(data, 'document');
          }
        });
      });
      beforeEach(function() {
        Rooms.remove({});
        Categories.remove({});
      });

      it('should notify subscribers in a room', function() {
        const room = Factory.create('room');
        assert.isArray(room.notify('test.notification', {document: {}}));
      });

      it('should omit some subscribers', function() {
        // subscriber should be automatically added on creation
        const post = Factory.create('post');
        // add another id to post's room
        post.addSubscriber(Random.id());
        assert.lengthOf(post.room().subscribers, 2);
        assert.lengthOf(post.notify('test.notification', {document: {}, without: [post.userId]}), 1);
      });

      it('should notify subscribers of a category', function() {
        const category = Factory.create('category');
        // notifications need subscribers
        category.room().addSubscriber(Random.id());
        assert.isArray(category.notify('test.notification', {document: {}}));
      });

      it('should notify category\'s room on post, but not post\'s author', function() {
        const category = Factory.create('category');
        const id = Random.id();
        let hookCheck = 0;
        notifications.set({
          'posts.insert': function(data) {
            assert.property(data, 'post');
            assert.property(data, 'sender');
            assert.property(data, 'recipientId');
            assert.property(data, 'category');
            assert.property(data, 'room');
            hookCheck += 1;
          }
        });
        category.addSubscriber(id); // add subscriber to category
        const post = Factory.create('post', {categories: [category._id], userId: id});
        const postTwo = Factory.create('post', {categories: [category._id]});
        assert.lengthOf(post.room().subscribers, 1);
        assert.equal(hookCheck, 1);
      });

      it('should notify post\'s room on comment, but not post\'s author', function() {
        const post = Factory.create('post');
        let hookCheck = 0;
        notifications.set({
          'comments.insert': function(data) {
            assert.property(data, 'comment');
            assert.property(data, 'sender');
            assert.property(data, 'recipientId');
            assert.property(data, 'post');
            assert.property(data, 'room');
            hookCheck += 1;
          }
        });
        const ownerComment = Factory.create('comment', {postId: post._id, userId: post.userId});
        const userComment = Factory.create('comment', {postId: post._id, userId: Random.id()});
        assert.lengthOf(post.room().subscribers, 2);
        assert.equal(hookCheck, 1);
      });
    }
  });
});
