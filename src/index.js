import path from 'path';

export default namespacePlugin;

const rootRegex = /^#root\//i;
const namespaceRegex = /^<(.*?)>\//i;

function handleRoot(source, rawVal, state) {
  const startPath = process.env.PWD || process.cwd();

  let val = rawVal.replace(rootRegex, '/path/to/root/folder/');

  let current = path.dirname(state.file.opts.filename);
  let destination = path.join(startPath, val);

  source.value = path.relative(current, destination);
}

function handleNamespace(source, rawVal, state) {
  const startPath = process.env.PWD || process.cwd();

  //match to namespace
  var namespace = namespaceRegex.exec(rawVal);

  if(namespace) {
    var matchNs = namespace[1];
    let val = rawVal.replace(namespaceRegex, '');

    let current = path.dirname(state.file.opts.filename);
    let destination = path.join(startPath, (state.opts.config[matchNs] || ''), val);

    source.value = path.relative(current, destination);
  }
}
function namespacePlugin({types: t}) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
         var source = path.node.source;
         var rawVal = source.extra.rawValue.replace('\'', '');
         var val = '';

         //match to root first
         var isRoot = rootRegex.exec(rawVal);

        if(isRoot) {
          handleRoot(source, rawVal, state);
          return;
        }

        handleNamespace(source, rawVal, state);

        return;
      }
    }
  };
}
