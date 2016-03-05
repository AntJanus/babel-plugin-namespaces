//testing
import test from 'ava';

//babel
import { transformFileSync } from 'babel-core';

import 'babel-register';

import plugin from '../src/';

test('namespaces', t => {
  var testFile = './fixtures/namespaced.js';

  var expected = `
    import action from './actions-folder/some-action/other';
  `;

  var result = transformFileSync(testFile, {
    plugins: [
      [plugin, {
          config: {
            actions: './actions-folder/'
          }
        }
      ]
    ]
  });

  t.is(expected.trim(), result.code.trim());
});

test('root', t => {
  var testFile = './fixtures/rooted.js';

  var expected = `
    import action from '/path/to/root/folder/src/actions-folder/some-action/other';
  `;

  var result = transformFileSync(testFile, {
    plugins: [
      ['../src', {
          config: {
            actions: './actions-folder/'
          }
        }
      ]
    ]
  });

  t.is(expected.trim(), result.code.trim());
});
