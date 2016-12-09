const withUser = (userId, data) => !!userId;
const noUser = (userId, data) => true;

export const config = {
  permit: {
    'posts.insert': withUser,
    'posts.update': withUser,
    'posts.delete': withUser,
    'posts.search': noUser,
    'posts.publish.single': noUser
  },

  messages: {
    'posts.loadMore': 'Load more posts...'
  }
};
