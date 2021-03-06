import { _ } from 'meteor/underscore';
import {
  general,
  permit,
  Posts,
  extendSchema
} from 'meteor/hotello:gyroscope';

const always = () => true;

permit.set({
  'posts.insert': always,
  'posts.update': always,
  'posts.remove': always,
  'posts.byQuery': always,

  'categories.insert': always,
  'categories.update': always,
  'categories.remove': always,

  'comments.insert': always,
  'comments.update': always,
  'comments.remove': always
});

Posts.extendSchema({
  title: {type: String, max: 300, label: 'Titolo'},
  body: {type: String, max: 3000, label: 'Contenuto', autoform: {rows: 10}},
  mozzarella: {
    type: Boolean,
    optional: true
  }
});
Posts.pickForMethods.push('mozzarella');
