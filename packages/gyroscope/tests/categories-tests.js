import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { Gyroscope } from '../lib/core/settings.js';
import { Categories, categoriesIndex } from '../lib/categories/categories.js';
import {
  insert,
  update,
  remove
} from '../lib/categories/methods.js';

Meteor.methods({
  'test.resetCategories': () => Categories.remove({}),
});

describe('categories', function() {
  describe('collection', function() {
    if (Meteor.isServer) {
      beforeEach(function() {
        Categories.remove({});
      });

      it('should insert category with auto values', function() {
        const category = Factory.create('category');

        assert.isObject(Categories.findOne());
        // categories must have a slug
        assert.isString(category.slug);
      });

      it('should alter categories with auto values', function() {
        const category = Factory.create('category');

        // check update
        Categories.update(category._id, {$set: Factory.tree('category')});
        assert.notEqual(category.slug, Categories.findOne(category._id).slug);
        // check upsert WARNING: we have a bug in aldeed:collection2-core, we can't upsert
        // Categories.upsert(category._id, {$set: Factory.tree('category')});
        // assert.equal(category.createdAt.getTime(), Categories.findOne(category._id).createdAt.getTime());
        // assert.notEqual(category.slug, Categories.findOne(category._id).slug);
      });
    }
  });

  describe('methods', function() {
    if (Meteor.isServer) {
      const userId = Random.id();
      let methodInvocation = {userId};

      beforeEach(function(done) {
        Meteor.call('test.resetCategories', done);
      });

      it('should insert categories', function() {
        const category = Factory.tree('category');
        const result = insert._execute(methodInvocation, category);

        assert.isString(result);
      });

      it('should update categories', function() {
        const categoryId = Factory.create('category')._id;
        const category = Factory.tree('category');
        const result = update._execute(methodInvocation, {_id: categoryId, modifier: {$set: category}});

        assert.equal(result, 1);
      });

      it('should remove categories', function() {
        const categoryId = Factory.create('category')._id;
        const result = remove._execute(methodInvocation, { categoryId });

        assert.equal(result, 1);
      });
    }
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

      it('should send a all categories', function (done) {
        const collector = new PublicationCollector();
        const category = Factory.create('category');

        collector.collect('categories.all', (collections) => {
          assert.equal(collections.categories.length, 1);
          done();
        });
      });
    }
  });
});
