//testing
import test from 'ava';

//babel
import { transform } from 'babel-core';

import 'babel-register';

test('namespaces', t => {
  var testCode = `
    import action from "#actions/some-action/other";
  `;

  var expected = `
    import action from './actions-folder/some-action/other';
  `;

  var result = transform(testCode, {
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

test('root', t => {
  var testCode = `
    import action from '/src/actions-folder/some-action/other';
  `;

  var expected = `
    import action from '/path/to/root/folder/src/actions-folder/some-action/other';
  `;

  var result = transform(testCode, {
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
