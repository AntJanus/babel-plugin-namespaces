# Babel Plugin for Javascript Namespaces

## Motivation

Trying to traverse the directory tree with modules is awkward at best. Imagine a simple front-end directory for Redux:

```
server/
shared/
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

**note:** I'd love a better example!

Trying to get an action from the shared view directory is a horrible experience. The import path would look something like `../../actions/ui-actions/someAction.js`. For larger projects, these directory hierarchies could easily expand. On top of that, what if you have shared libraries between back-end and front-end?

You'd have to access that library via `../../../shared/someSharedLib.js`. This can quickly get confusing.

There's also the issue of moving directories. I often find myself figuring out better ways to structure directories. For instance, the front-end library could be refactor to look like:

```
src/
  shared/
    actions/
    views/
    reducers/
  home/
    actions/
    reducers/
    views/
```

You'd end up rewriting all of the paths in the entire directory and spending major time doing this.

## Solution

The babel plugin will create config paths for namespaces. Example:

```
{
  root: "./src",
  sharedLib: "./shared",
  sharedFrontEnd: "./src/shared/"
}
```

And so on. That way, you'd only have to write an import as such:

```
import sharedLib from '\sharedLib/someShared.js';
import frontendView from '\sharedFrontEnd/views/frontendView.js';
```

and so on. Making imports much easier.
    
