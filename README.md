# Conventional Commits GitHub Action

A simple GitHub action that makes sure all commit messages are following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) specification.

### Usage

```yml
name: Build

on:
  pull_request:
    branches: [ master ]

jobs:
  build:
    name: Conventional Commits
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: webiny/action-conventional-commits@v1.0.1
```
