import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { Categories } from '../lib/categories/categories.js';
import {
  insert,
  update,
  remove
} from '../lib/categories/methods.js';

describe('categories', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Categories.remove({});
      });

      it('should insert category with auto values', function() {
        const category = Factory.create('category');
        assert.isObject(Categories.findOne());
      });

      it('should alter categories with auto values', function() {
        const category = Factory.create('category');
        // check update
        const updateResult = Categories.update(category._id, {$set: Factory.tree('category')});
        assert.equal(updateResult, 1);
        // check upsert
        const upsertResult = Categories.upsert(category._id, {$set: Factory.tree('category')});
        assert.equal(upsertResult.numberAffected, 1);
      });
    }
  });

  describe('methods', function() {
    const methods = Categories.methods;
    const userId = Random.id();
    let methodInvocation = {userId};

    beforeEach(function() {
      if (Meteor.isServer) Categories.remove({});
    });

    it('should insert categories', function() {
      const category = Factory.tree('category');
      const result = methods.insert._execute(methodInvocation, category);

      assert.isString(result);
    });

    it('should update categories', function() {
      const categoryId = Factory.create('category')._id;
      const category = Factory.tree('category');
      const result = methods.update._execute(methodInvocation, {_id: categoryId, modifier: {$set: category}});

      assert.equal(result, 1);
    });

    it('should remove categories', function() {
      const docId = Factory.create('category')._id;
      const result = methods.remove._execute(methodInvocation, { docId });

      assert.equal(result, 1);
    });
  });

  describe('publications', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Categories.remove({});
      });

      it('should send a single category', function (done) {
        const collector = new PublicationCollector();
        const category = Factory.create('category');

        collector.collect('categories.single', category._id, (collections) => {
          assert.equal(collections.categories.length, 1);
          done();
        });
      });

      it('should send all categories', function (done) {
        const collector = new PublicationCollector();
        const category = Factory.create('category');
        const categoryTwo = Factory.create('category');
        const queryParams = {limit: 1};

        collector.collect('categories.byQuery', 'categories.all', queryParams, (collections) => {
          assert.equal(collections.categories.length, 1);
          done();
        });
      });
    }
  });
});
