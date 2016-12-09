import { Gyroscope } from 'meteor/hotello:gyroscope';

const canFn = (userId, data) => {
  return userId ? true : false;
};

export const gyroscope = new Gyroscope({
  permissions: {
    'posts.insert': canFn,
    'posts.update': canFn,
    'posts.delete': canFn,
    'posts.search': () => true
  }
});
