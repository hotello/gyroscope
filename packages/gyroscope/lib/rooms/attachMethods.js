import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit } from '../core/settings.js';

export const attachMethods = function(collection) {
  if (!_.has(collection, 'methods')) {
    collection.methods = {};
  }
  // method for adding subscriber
  collection.methods.addSubscriber = new ValidatedMethod({
    name: `${collection._name}.addSubscriber`,
    validate: new SimpleSchema({
      documentId: { type: String, regEx: SimpleSchema.RegEx.Id }
    }).validator(),
    run({ documentId }) {
      let doc;
      // add a permissions hook
      if (permit.notToDo(this.userId, `${collection._name}.addSubscriber`, { documentId })) {
        throw new Meteor.Error(`${collection._name}.addSubscriber.unauthorized`);
      }
      // find the document for adding subscriber to its room
      doc = collection.findOne(documentId);
      // check for document existing
      if (!doc) throw new Meteor.Error(`${collection._name}.addSubscriber.notFound`);
      // add subscriber to document's room
      return doc.addSubscriber(this.userId);
    }
  });

  // method for removing subscriber
  collection.methods.removeSubscriber = new ValidatedMethod({
    name: `${collection._name}.removeSubscriber`,
    validate: new SimpleSchema({
      documentId: { type: String, regEx: SimpleSchema.RegEx.Id }
    }).validator(),
    run({ documentId }) {
      let doc;
      // add a permissions hook
      if (permit.notToDo(this.userId, `${collection._name}.removeSubscriber`, { documentId })) {
        throw new Meteor.Error(`${collection._name}.removeSubscriber.unauthorized`);
      }
      // find the document for removing subscriber from its room
      doc = collection.findOne(documentId);
      // check for document existing
      if (!doc) throw new Meteor.Error(`${collection._name}.removeSubscriber.notFound`);
      // remove
      return doc.removeSubscriber(this.userId);
    }
  });

  // method for removing user
  collection.methods.removeUser = new ValidatedMethod({
    name: `${collection._name}.removeUser`,
    validate: new SimpleSchema({
      documentId: { type: String, regEx: SimpleSchema.RegEx.Id }
    }).validator(),
    run({ documentId }) {
      let doc;
      // add a permissions hook
      if (permit.notToDo(this.userId, `${collection._name}.removeUser`, { documentId })) {
        throw new Meteor.Error(`${collection._name}.removeUser.unauthorized`);
      }
      // find the document for removing user from its room
      doc = collection.findOne(documentId);
      // check for document existing
      if (!doc) throw new Meteor.Error(`${collection._name}.removeUser.notFound`);
      // remove
      return doc.removeUser(this.userId);
    }
  });
};
