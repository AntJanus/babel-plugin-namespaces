import path from 'path';

export default namespacePlugin;

const rootRegex = /^\/(.*?)\//;
const namespaceRegex = /^\#(.*?)\//i;

function namespacePlugin({types: t}) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
         var source = path.node.source;
         var rawVal = source.value;
         var val = '';

         //match to root first
         var isRoot = rootRegex.exec(rawVal);

         if(isRoot) {
           val = rawVal.replace(rootRegex, '/path/to/root/folder/');
           source.value = val;
           return;
         }

         //match to namespace
         var namespace = namespaceRegex.exec(rawVal);

         if(namespace) {
           var matchNs = namespace[1];
           val = rawVal.replace(namespaceRegex, '');

           source.value = (state.opts.config[matchNs] || '') + val;
         }
      }
    }
  };
}
