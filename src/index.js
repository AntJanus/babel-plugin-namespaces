export default namespacePlugin;

const rootRegex = /^\/(.*)\//;
const namespaceRegex = /^\\(.*)\//;

function namespacePlugin({types: t}) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
         var source = path.node.source;
         var rawVal = source.extra.raw.replace(/'/g, '');

         //match to root first
         var isRoot = rawVal.match(rootRegex);
         var

         //match to namespace
         var namespace = rawVal.match(namespaceRegex);
         var matchNs = namespace[1];

         if(matchNs) {
           source.value = state.opts.config[matchNs] || path.node.source.value;
         }
      }
    }
  };
}
