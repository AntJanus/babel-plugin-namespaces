//testing
import test from 'ava';

//babel
import { transform } from 'babel-core';

import 'babel-register';

test('namespaces', t => {
  var testCode = `
    import action from '\actions/some-action/other';
  `;

  var expected = `
    import action from './actions/some-action/other';
  `;

  var result = transform(testCode, {
    plugins: [
      ['../src', {
          actions: './actions'
        }
      ]
    ]
  });

  console.log(result, 'result');
  t.is(expected, result);
});
