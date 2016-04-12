import path from 'path';

export default namespacePlugin;

const namespaceRegex = /^<(.*?)>\//i;

function normalizePath(p) {
    var normalized = p.split(path.sep);

    //without ./, node assumes external package
    return './' + normalized.join('/');
}

function handleRoot(source, rawVal, state) {
  const startPath = process.cwd();

  let val = rawVal.replace(rootRegex, '');

  let current = path.dirname(state.file.opts.filename);
  let destination = path.join(startPath, '.', val);

  source.value = normalizePath(path.relative(current, destination));
}

function handleNamespace(source, rawVal, state) {
  const startPath = process.cwd();

  //match to namespace
  var namespace = namespaceRegex.exec(rawVal);

  if(namespace && namespace[1]) {
    var matchNs = namespace[1];

    if(!state.opts.config[matchNs]) {
      console.log('Undeclared namespace detected: ', matchNs);

      return;
    }

    let val = rawVal.replace(namespaceRegex, '');

    let current = path.dirname(state.file.opts.filename);
    let destination = path.join(startPath, (state.opts.config[matchNs] || ''), val);

    source.value = normalizePath(path.relative(current, destination));
  }
}

function namespacePlugin({types: t}) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        var source = path.node.source;

	//usually happens when a conflict with a plugin arises
	if(!source.extra || !source.extra.rawValue) {
           return;
	}

        var rawVal = source.extra.rawValue.replace('\'', '');
        var val = '';

        handleNamespace(source, rawVal, state);

        return;
      }
    }
  };
}
