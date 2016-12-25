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

  messages: {
    'posts.loadMore': 'Load more posts...'
  },

  notifications: {
    'posts.insert': function(data) {
      console.log(`Notified posts.insert for: ${data.post.title}`);
    },
    'comments.insert': function(data) {
      console.log(`Nofified comments.insert for: ${data.comment.body}`);
    }
  },

  queries: {
    'posts.byCategory': function(params) {
      const MAX_TODOS = 1000;
      return {
        selector: {categories: {$in: [params.categoryId]}},
        options: {
          sort: {title: 1},
          limit: Math.min(params.limit, MAX_TODOS)
        }
      };
    },
    'categories.all': function(params) {
      const MAX_CATEGORIES = 1000;
      return {
        selector: {},
        options: {
          sort: {name: 1},
          limit: Math.min(params.limit, MAX_CATEGORIES)
        }
      };
    },
    'comments.byPost': function(params) {
      const MAX_COMMENTS = 1000;
      return {
        selector: {postId: params.postId},
        options: {
          sort: {createdAt: -1},
          limit: Math.min(params.limit, MAX_COMMENTS)
        }
      };
    }
  }
};
