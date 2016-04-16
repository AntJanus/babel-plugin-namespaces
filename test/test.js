//testing
import test from 'ava';

//babel
import { transformFileSync } from 'babel-core';

import 'babel-register';

import plugin from '../src/';

test('namespace within same directory tree', t => {
  var testFile = './fixtures/namespaced.js';

  var expected = './actions-folder/some-action/other';

  var result = transformFileSync(testFile, {
    plugins: [
      [plugin, {
          namespaces: {
            actions: './fixtures/actions-folder/'
          }
        }
      ]
    ]
  });

  var match = /require\('(.*?)'\)/i.exec(result.code);

  t.is(match[1].trim(), expected.trim());
});

test('namespace replacement outside of directory', t => {
  var testFile = './fixtures/namespaced.js';

  var expected = './../actions-folder/some-action/other';

  var result = transformFileSync(testFile, {
    plugins: [
      [plugin, {
          namespaces: {
            actions: './actions-folder/'
          }
        }
      ]
    ]
  });

  var match = /require\('(.*?)'\)/i.exec(result.code);

  t.is(match[1].trim(), expected.trim());
});

test('leaving namespace alone', t => {
  var testFile = './fixtures/namespaced.js';

  var expected = '<actions>/some-action/other';

  var result = transformFileSync(testFile, {
    plugins: [
      [plugin, {
          namespaces: {
          }
        }
      ]
    ]
  });

  var match = /require\('(.*?)'\)/i.exec(result.code);

  t.is(match[1].trim(), expected.trim());
});

test('root default namespace', t => {
  var testFile = './fixtures/rooted.js';

  var expected = './../src/actions-folder/some-action/other';

  var result = transformFileSync(testFile, {
    plugins: [
      [plugin, {
          namespaces: {
            actions: './fixtures/actions-folder/'
          }
        }
      ]
    ]
  });

  var match = /require\('(.*?)'\)/i.exec(result.code);

  t.is(match[1].trim(), expected.trim());
});
