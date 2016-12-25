import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { permit, general } from '../core/settings.js';
import { Comments } from './comments.js';
import { ID_FIELD } from '../core/collections-helpers.js';

// dynamically generate the methods schema
export const generateCommentsMethodsSchema = function() {
  return Comments.simpleSchema().pick(general.get('comments.methods.schema'));
};
// accept only ids
export const COMMENTS_ID_ONLY = new SimpleSchema({
  commentId: ID_FIELD
});

export const insert = new ValidatedMethod({
  name: 'comments.insert',
  validate(comment) {
    generateCommentsMethodsSchema().validate(comment)
  },
  run(comment) {
    if (permit.notToDo(this.userId, 'comments.insert')) {
      throw new Meteor.Error('comments.insert.unauthorized');
    }
    // set userId for comment
    comment.userId = this.userId;

    return Comments.insert(comment);
  }
});

export const update = new ValidatedMethod({
  name: 'comments.update',
  validate({ _id, modifier }) {
    COMMENTS_ID_ONLY.validate({commentId: _id});
    generateCommentsMethodsSchema().validate(modifier, {modifier: true});
  },
  run({ _id, modifier }) {
    if (permit.notToDo(this.userId, 'comments.update')) {
      throw new Meteor.Error('comments.update.unauthorized');
    }

    return Comments.update(_id, modifier);
  }
});

export const remove = new ValidatedMethod({
  name: 'comments.remove',
  validate: COMMENTS_ID_ONLY.validator(),
  run({ commentId }) {
    if (permit.notToDo(this.userId, 'comments.remove')) {
      throw new Meteor.Error('comments.remove.unauthorized');
    }

    return Comments.remove(commentId);
  }
});
