export default function ({types: t}) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
         var source = path.node.source;
         var rawVal = source.extra.raw;
         var namespace = rawVal.match(/\\([aA-zZ0-9]*)\//);
         var matchNs = namespace[1];
         path.node.source.value = state.opts.config[matchNs] || path.node.source.value;
      }
    }
  };
}
