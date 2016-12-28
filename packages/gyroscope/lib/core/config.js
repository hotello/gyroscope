const withUser = (userId, data) => !!userId;
const noUser = (userId, data) => true;

export const config = {
  general: {
    // settings for assets
    'assets': false,
    'assets.emailTemplates': 'assets/email-templates'
  },

  permit: {
    'posts.insert': withUser,
    'posts.update': withUser,
    'posts.remove': withUser,
    'posts.publish.byQuery': noUser,
    'posts.publish.single': noUser,

    'categories.insert': withUser,
    'categories.update': withUser,
    'categories.remove': withUser,
    'categories.publish.byQuery': noUser,
    'categories.publish.single': noUser,

    'comments.insert': withUser,
    'comments.update': withUser,
    'comments.remove': withUser,
    'comments.publish.byQuery': noUser,
    'comments.publish.single': noUser
  },

  notifications: {
    'posts.insert': function(data) {
      console.log(`Notified posts.insert for: ${data.post.title}`);
    },
    'comments.insert': function(data) {
      console.log(`Nofified comments.insert for: ${data.comment.body}`);
    }
  }
};
