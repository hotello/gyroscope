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
});

messages.set({
  'posts.loadMore': 'Carega carega!!!'
});
