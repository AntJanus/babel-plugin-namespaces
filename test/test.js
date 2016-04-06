//testing
import test from 'ava';

//babel
import { transformFileSync } from 'babel-core';

import 'babel-register';

import plugin from '../src/';

test('namespaces', t => {
  var testFile = './fixtures/namespaced.js';

  var expected = '../actions-folder/some-action/other';

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

  var match = /require\('(.*?)'\)/i.exec(result.code);

  t.is(match[1].trim(), expected.trim());
});

/////////////////////////////////////////////////////////////
// test('root', t => {                                     //
//   var testFile = './fixtures/rooted.js';                //
//                                                         //
//   var expected = '../actions-folder/some-action/other'; //
//                                                         //
//   var result = transformFileSync(testFile, {            //
//     plugins: [                                          //
//       [plugin, {                                        //
//           config: {                                     //
//             actions: './actions-folder/'                //
//           }                                             //
//         }                                               //
//       ]                                                 //
//     ]                                                   //
//   });                                                   //
//                                                         //
//   var match = /require\('(.*?)'\)/i.exec(result.code);  //
//                                                         //
//   t.is(match[1].trim(), expected.trim());               //
// });                                                     //
/////////////////////////////////////////////////////////////
