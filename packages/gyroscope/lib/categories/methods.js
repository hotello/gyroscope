import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit, general } from '../core/settings.js';
import { Categories } from './categories.js';
import { ID_FIELD } from '../core/collections-helpers.js';

// dynamically generate the methods schema
export const generateCategoriesMethodsSchema = function() {
  return Categories.simpleSchema().pick(general.get('categories.methods.schema'));
};
// accept only ids
export const CATEGORIES_ID_ONLY = new SimpleSchema({
  categoryId: ID_FIELD
});

export const insert = new ValidatedMethod({
  name: 'categories.insert',
  validate(category) {
    generateCategoriesMethodsSchema().validate(category);
  },
  run(category) {
    if (permit.notToDo(this.userId, 'categories.insert')) {
      throw new Meteor.Error('categories.insert.unauthorized');
    }

    return Categories.insert(category);
  }
});

export const update = new ValidatedMethod({
  name: 'categories.update',
  validate({ _id, modifier }) {
    CATEGORIES_ID_ONLY.validate({categoryId: _id});
    generateCategoriesMethodsSchema().validate(modifier, {modifier: true});
  },
  run({ _id, modifier }) {
    if (permit.notToDo(this.userId, 'categories.update')) {
      throw new Meteor.Error('categories.update.unauthorized');
    }

    return Categories.update(_id, modifier);
  }
});

export const remove = new ValidatedMethod({
  name: 'categories.remove',
  validate: CATEGORIES_ID_ONLY.validator({ clean: true }),
  run({ categoryId }) {
    if (permit.notToDo(this.userId, 'categories.remove')) {
      throw new Meteor.Error('categories.remove.unauthorized');
    }

    return Categories.remove(categoryId);
  }
});
