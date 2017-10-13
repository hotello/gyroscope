Package.describe({
  name: 'hotello:gyroscope',
  version: '0.6.0',
  // Brief, one-line summary of the package.
  summary: 'Extensible social components like posts, comments and more.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/hotello/gyroscope.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');

  api.use([
    'meteor-base@1.0.0',
    'mongo@1.0.0',
    'blaze-html-templates@1.0.0',
    'email@1.0.0',

    'ecmascript@0.6.0',

    'aldeed:simple-schema@1.5.0',
    'aldeed:collection2@2.10.0',
    'dburles:collection-helpers@1.0.0',
    'aldeed:autoform@5.8.0',
    'mdg:validated-method@1.0.0',
    'meteorhacks:ssr@2.0.0',

    'hotello:useful-dicts@1.0.2',
    'hotello:collection-fast@1.5.0'
  ]);

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});

Package.onTest(function(api) {
  api.use('hotello:gyroscope');

  api.use([
    'ecmascript@0.6.0',
    'practicalmeteor:mocha@2.0.0',
    'johanbrook:publication-collector@1.0.0',
    'dburles:factory@1.0.0',
    'accounts-base@1.2.0'
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
