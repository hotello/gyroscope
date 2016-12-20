import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit } from '../core/settings.js';
import { Categories } from './categories.js';
import { ID_FIELD } from '../core/collections-helpers.js';

// common validator for methods
export const CATEGORIES_METHODS_SCHEMA = new SimpleSchema({
  name: Categories.simpleSchema().schema('name'),
  description: Categories.simpleSchema().schema('description'),
  image: Categories.simpleSchema().schema('image')
});
// accept only ids
export const CATEGORIES_ID_ONLY = new SimpleSchema({
  categoryId: ID_FIELD
});

export const insert = new ValidatedMethod({
  name: 'categories.insert',
  validate: CATEGORIES_METHODS_SCHEMA.validator({ clean: true }),
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
    CATEGORIES_METHODS_SCHEMA.validate(modifier, {modifier: true});
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
