const withUser = (userId, data) => !!userId;
const noUser = (userId, data) => true;

export const config = {
  permit: {
    'posts.insert': withUser,
    'posts.update': withUser,
    'posts.remove': withUser,
    'posts.search': noUser,
    'posts.publish.single': noUser,

    'categories.insert': withUser,
    'categories.update': withUser,
    'categories.remove': withUser,
    'categories.publish.all': noUser,
    'categories.publish.single': noUser
  },

  messages: {
    'posts.loadMore': 'Load more posts...'
  },

  notifications: {
    'posts.new': function(data) {
      console.log(data);
    }
  }
};
