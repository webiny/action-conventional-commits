## Getting Started

1. Fork and clone the repository locally.
2. Run `yarn` to install all of the dependencies.
3. Start developing with the `yarn watch` command.
4. Tests can be run with the `yarn test` command.
5. Build code with the `yarn build` command.

## Releasing a New Version

First, build all the code via `yarn build`.

Secondly, commit all of the changes you have locally (even the changes in `dist` folder) and then use the following commands to create a tag and push / release everything:

```
git tag -a -m "Release v1.0.19" v1.0.19
git push --follow-tags
```

