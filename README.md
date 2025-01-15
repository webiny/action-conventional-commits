# Conventional Commits GitHub Action

A simple GitHub action that makes sure all commit messages are following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) specification.

![Screenshot](/docs/screenshot.png)

Note that, typically, you would make this check on a pre-commit hook (for example, using something like [Commitlint](https://commitlint.js.org/)), but those can easily be skipped, hence this GitHub action.

### Usage
Latest version: `v2.0.0`

```yml
name: Conventional Commits

on:
  pull_request:
    branches: [ master ]

jobs:
  build:
    name: Conventional Commits
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: webiny/action-conventional-commits@v2.0.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Optional, for private repositories.
          allowed-commit-types: "feat,fix" # Optional, set if you want a subset of commit types to be allowed.
```
