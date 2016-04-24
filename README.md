![logo](graphics/logo.png)
# Babel Plugin for Javascript Namespaces

Build status: [![Circle CI](https://circleci.com/gh/AntJanus/babel-plugin-namespaces/tree/master.svg?style=svg)](https://circleci.com/gh/AntJanus/babel-plugin-namespaces/tree/master)

## Installation

This module is distributed using [npm](https://npmjs.com) which comes bundled with [node](https://nodejs.org):

```console
npm install --save-dev babel-plugin-namespaces
```

## Motivation

Trying to traverse the directory tree with modules is awkward at best. Imagine a simple front-end directory for Redux:

```
server/
universal/
src/
  actions/
    ui-actions/
    data-actions/
  reducers/
    ui-reducers/
    data-reducers/
  views/
    shared/
    home/
    blog/
```

Trying to get an action from the shared view directory is a horrible experience. The import path would look something like `../../actions/ui-actions/someAction.js`. For larger projects, these directory hierarchies could easily expand. On top of that, what if you have shared libraries between back-end and front-end?

From the same view, you'd have to access that universal library via `../../../universal/utils/util`. These long paths are often error-prone and are guess work at best on larger projects.

## Directory namespacing

The babel plugin will create config paths for namespaces. Example:

```js
{
  namespaces: {
    actions: './src/actions',
	reducers: './src/reducers',
	views: './src/views',
	universal: './universal'
  }
}
```

And so on. That way, you'd only have to write an import as such no matter where your code rests relative to the libraries you want to import:

```js
import utils from '<universal>/utils';
import { fetchTasks, addTask } from '<actions>/data-actions/tasks';
import taskView from '<views>/shared/task';
```

Imagine that the above declaration resided in `./src/views/home/home.js` view. The compiled result would look like this:

```js
import utils from '../../../universal/utils';
import { fetchTasks, addTask } from '../../actions/data-actions/tasks';
import taskView from '../shared/task';
```

## Root pathing

What if you don't want to create a namespace for every major directory or module? You're welcome to use the default `<root>` namespace which allows you setup pathing from the root of your project. The previous imports could be easily rewritten as:

```js
import utils from '<root>/universal/utils';
import { fetchTasks, addTask } from '<root>/src/actions/data-actions/tasks';
import taskView from '<root>/src/views/shared/task';
```

## Individual module namespacing

Beside being able to specify namespaces for frequently used directories and paths, you can also specify full paths to modules. Let's look at our `utils` example from above. We'll add a new namespace:

```js
{
  namespaces: {
    actions: './src/actions',
	reducers: './src/reducers',
	views: './src/views',
	universal: './universal',
	"universal/utils": './universal/utils'
  }
}
```

Our previous import would be simplified to use:

```js
import utils from '<universal/utils>';
```

Since the plugin works on a simple search/replace mechanism, the namespace for our universal utilities could easily just be `<utils>`.

## Better Organization

## Roadmap

- [x] basic pathing and settings
- [x] root pathing: `<root>`
- [x] config -> namespaces, and add `options` key
- [ ] support for plain requires
- [x] transpilation to ES5
