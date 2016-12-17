import { Gyroscope } from 'meteor/hotello:gyroscope';

const always = () => true;

Gyroscope.permit.setPermissions({
  'posts.insert': always,
  'posts.update': always,
  'posts.remove': always,
  'posts.search': always,

  'categories.insert': always,
  'categories.update': always,
  'categories.remove': always,
});

Gyroscope.messages.setMessages({
  'posts.loadMore': 'Carega carega!!!'
});
