'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = namespacePlugin;


var namespaceRegex = /^<(.*?)>\//i;

function namespacePlugin(_ref) {
  var t = _ref.types;


  var defaults = {
    namespaces: {
      root: '.'
    }
  };

  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        if (path.node.callee.name === 'require') {
          var localState = setupDefaults(state, defaults);

          var source = path.node.arguments[0];

          //usually happens when a conflict with a plugin arises
          if (!source.extra || !source.extra.rawValue) {
            return;
          }

          var rawVal = source.extra.rawValue.replace('\'', '');
          var val = '';

          handleNamespace(source, rawVal, localState);

          return;
        }
      },
      ImportDeclaration: function ImportDeclaration(path, state) {
        var localState = setupDefaults(state, defaults);

        var source = path.node.source;

        //usually happens when a conflict with a plugin arises
        if (!source.extra || !source.extra.rawValue) {
          return;
        }

        var rawVal = source.extra.rawValue.replace('\'', '');
        var val = '';

        handleNamespace(source, rawVal, localState);

        return;
      }
    }
  };
}

function setupDefaults(state, defaults) {
  var localState = (0, _assign2.default)({}, state);

  if (state.opts.namespaces.root) {
    console.log('WARNING: Default <root> namespaces is being overwritten.');
  }

  localState.opts.namespaces = (0, _assign2.default)({}, defaults.namespaces, state.opts.namespaces);

  return localState;
}

function handleNamespace(source, rawVal, state) {
  var startPath = process.cwd();

  //match to namespace
  var namespace = namespaceRegex.exec(rawVal);

  if (namespace && namespace[1]) {
    var matchNs = namespace[1];

    if (!state.opts.namespaces[matchNs]) {
      console.log('WARNING: Undeclared namespace detected: ', matchNs);

      return;
    }

    var val = rawVal.replace(namespaceRegex, '');

    var current = _path2.default.dirname(state.file.opts.filename);
    var destination = _path2.default.join(startPath, state.opts.namespaces[matchNs] || '', val);

    source.value = normalizePath(_path2.default.relative(current, destination));
  }
}

function normalizePath(p) {
  var normalized = p.split(_path2.default.sep);

  //without ./, node assumes external package
  return './' + normalized.join('/');
}