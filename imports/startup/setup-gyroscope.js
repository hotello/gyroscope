import {
  permit,
  messages
} from 'meteor/hotello:gyroscope';

const always = () => true;

permit.set({
  'posts.insert': always,
  'posts.update': always,
  'posts.remove': always,
  'posts.search': always,

  'categories.insert': always,
  'categories.update': always,
  'categories.remove': always,

  'comments.insert': always,
  'comments.update': always,
  'comments.remove': always
});

messages.set({
  'posts.loadMore': 'Carega carega!!!'
});
