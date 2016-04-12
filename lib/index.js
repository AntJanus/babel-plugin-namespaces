'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = namespacePlugin;


var namespaceRegex = /^<(.*?)>\//i;

function normalizePath(p) {
  var normalized = p.split(_path2.default.sep);

  //without ./, node assumes external package
  return './' + normalized.join('/');
}

function handleRoot(source, rawVal, state) {
  var startPath = process.cwd();

  var val = rawVal.replace(rootRegex, '');

  var current = _path2.default.dirname(state.file.opts.filename);
  var destination = _path2.default.join(startPath, '.', val);

  source.value = normalizePath(_path2.default.relative(current, destination));
}

function handleNamespace(source, rawVal, state) {
  var startPath = process.cwd();

  //match to namespace
  var namespace = namespaceRegex.exec(rawVal);

  if (namespace && namespace[1]) {
    var matchNs = namespace[1];

    if (!state.opts.config[matchNs]) {
      console.log('Undeclared namespace detected: ', matchNs);

      return;
    }

    var val = rawVal.replace(namespaceRegex, '');

    var current = _path2.default.dirname(state.file.opts.filename);
    var destination = _path2.default.join(startPath, state.opts.config[matchNs] || '', val);

    source.value = normalizePath(_path2.default.relative(current, destination));
  }
}

function namespacePlugin(_ref) {
  var t = _ref.types;

  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, state) {
        var source = path.node.source;

        //usually happens when a conflict with a plugin arises
        if (!source.extra || !source.extra.rawValue) {
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