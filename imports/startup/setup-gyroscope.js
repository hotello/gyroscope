import { Gyroscope } from 'meteor/hotello:gyroscope';

const always = () => true;

Gyroscope.permit.setPermissions({
  'posts.insert': always,
  'posts.update': always,
  'posts.delete': always,
  'posts.search': always
});

Gyroscope.messages.setMessages({
  'posts.loadMore': 'Carega carega!!!'
});
