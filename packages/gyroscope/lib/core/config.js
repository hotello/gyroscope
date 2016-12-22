const withUser = (userId, data) => !!userId;
const noUser = (userId, data) => true;

export const config = {
  general: {
    'assets': false,
    'assets.emailTemplates': 'assets/email-templates'
  },

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
    'posts.insert': function(data) {
      console.log(`Notified post.insert for: ${data.post.title}`);
    }
  }
};
