Package.describe({
  name: 'hotello:gyroscope',
  version: '0.4.0',
  // Brief, one-line summary of the package.
  summary: 'Extensible social components like posts, comments and more.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/hotello/gyroscope.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');

  api.use([
    'meteor-base@1.0.4',
    'mobile-experience@1.0.4',
    'mongo@1.1.14',
    'blaze-html-templates@1.0.5',
    'reactive-var@1.0.11',
    'reactive-dict@1.1.8',
    'jquery@1.11.10',
    'tracker@1.1.1',
    'email@1.1.18',

    'standard-minifier-js@1.2.1',
    'es5-shim@4.6.15',
    'ecmascript@0.6.1',

    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.10.0',
    'dburles:collection-helpers@1.1.0',
    'dburles:factory@1.1.0',
    'aldeed:autoform@5.8.1',
    'mdg:validated-method@1.1.0',
    'meteorhacks:ssr@2.2.0',

    'hotello:useful-dicts@1.0.2',
    'hotello:collection-fast@1.4.2'
  ]);

  api.addAssets([
    'assets/email-templates/default.html'
  ], 'server');

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});

Package.onTest(function(api) {
  api.use('hotello:gyroscope');

  api.use([
    'ecmascript@0.6.1',
    'practicalmeteor:mocha@2.4.5_6',
    'johanbrook:publication-collector@1.0.5',
    'accounts-base@1.2.14',
  ]);

  api.addFiles([
    'tests/tests-helpers.js',
    'tests/core-tests.js',
    'tests/posts-tests.js',
    'tests/categories-tests.js',
    'tests/rooms-tests.js',
    'tests/comments-tests.js'
  ]);
});
