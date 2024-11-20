# Developing

## Getting started

This project uses [pnpm version 8](https://pnpm.io/) for package management. If you don't have it installed, you can install it with `npm i -g pnpm@8`.

We also use Node version 16, 18 or 20. You can use [nvm](https://github.com/nvm-sh/nvm) to manage your node versions.

This project was created with [Nx](https://nx.dev). You can install it with `pnpm i -g nx`. There is also an NX Console plugin available for VS Code and WebStorm that you might find handy.

## Setup

Once you've setup your environment, you can install the dependencies with:

```shell
pnpm i
```

## Testing

You can run the unit tests with:

```shell
pnpm test
```

## Linting

You can run the linter with:

```shell
pnpm lint
```

## Duplicate Code

We are very careful to not duplicate our code. You can run the duplicate code checker with:

```shell
pnpm dupcheck
```

## Code Formatting

We use [Prettier](https://prettier.io/) for code formatting. You can run the formatter with:

```shell
pnpm format
```

## Submitting Pull Requests

**Please follow these basic steps to simplify pull request reviews. If you don't you'll probably just be asked to anyway.**

- Please rebase your branch against the current main.
- Run the `Setup` command to make sure your development dependencies are up-to-date.
- Please ensure the CI suite passes before submitting a PR. You can create a draft pull request if you'd like the CI system to run the checks for you.
- If you've added new functionality, **please** include tests which validate its behavior. We currently have a 100% branch coverage policy.
- Make reference to possible [issues](https://github.com/DaveMBush/SmartNgRX/issues) on PR comment.

## Submitting bug reports

- Search through issues to see if a previous issue has already been reported and/or fixed.
- Provide a _small_ reproduction using a [StackBlitz project](https://stackblitz.com/) or a GitHub repository.
- Please detail the affected browser(s) and operating system(s).
- Please be sure to state which version of Angular, node, and pnpm you're using.

## Submitting new features

- We value keeping the API surface small and concise, which factors into whether new features are accepted.
- Submit an issue with the label 'feature request' with your feature request.
- The feature will be discussed and considered.
- Once the PR is submitted, it will be reviewed and merged once approved.

## Questions and requests for support

Questions and requests for support should not be opened as issues and should be handled in the following ways:

- Start a new [Q&A Discussion](https://github.com/DaveMBush/SmartNgRX/discussions/categories/q-a) on GitHub.

## <a name="commit"></a> Pull Request Guidelines

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **tests**: Adding missing tests or correcting existing tests

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this pull request **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

Example:

```
feat: PR message

BREAKING CHANGES:

Describe breaking changes here

BEFORE:

Previous code example here

AFTER:

New code example here
```
