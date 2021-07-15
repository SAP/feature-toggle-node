## Open Development

Development is executed on GitHub. 
Both core team members and external contributors send pull requests which go through the same review process.

## Legal

All contributors must sign the DCO

- https://cla-assistant.io/SAP/feature-toggle-node

This is managed automatically via https://cla-assistant.io/ pull request voter.

## Branch Organization

We will do our best to keep the master branch in a good shape, with tests passing at all times. 
But in order to move fast, we will make API changes that your application might not be compatible with. 
We recommend that you use the latest stable version.

If you send a pull request, please do it against the `master` branch. 
We may maintain stable branches for major versions separately but we don’t accept pull requests to them directly. 
Instead, we cherry-pick non-breaking changes from master to the latest stable major version.


## Semantic Versioning

feature-toggle-node follows semantic versioning. 
We release patch versions for bug-fixes, minor versions for new features, and major versions for any breaking changes. 
When we make breaking changes, we also introduce deprecation warnings in a minor version 
so that our users learn about the upcoming changes and migrate their code in advance.
Every significant change will be documented in the changelog file.


## Sending a Pull Request

The team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. 


## Before submitting a pull request, please make sure the following is done:

1. Fork the repository and create your branch from master.
2. Run `npm install` in the repository root.
3. If you’ve fixed a bug or added code make sure the code is tested.
4. Run `npm run ci` to ensure all code compiles,tests pass, linting etc.
5. See commit prefix section.

## Commit Messages

This project uses [conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) with the [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).
Recommanded: Use `git cz` to build conventional commit messages.
- requires [commitizen](https://github.com/commitizen/cz-cli#installing-the-command-line-tool) to be installed.

### Commit Prefix

- [feat] (new feature for the user, not a new feature for build script)
- [fix] (bug fix for the user, not a fix to a build script)
- [docs] (changes to the documentation)
- [style] (formatting, missing semi colons, etc; no production code change)
- [refactor] (refactoring production code, eg. renaming a variable)
- [test] (adding missing tests, refactoring tests; no production code change)
- [chore] (updating grunt tasks etc; no production code change)

## Create new release
Pushing a new tag with bumped version triggers the CI to create a new release which will be available on [NPMJS feature-toggle-node](https://www.npmjs.com/package/@sap-devx/feature-toggle-node).<br><br>

Make sure the remote master branch contains the code for the new release and follow the next steps:
1. On your computer, checkout the master branch

2. Run:
    ```
    git pull origin master
    ```

3. In the repository root master branch, Run:
    ```
    npm install
    ``` 

4.	Create a new branch for the release
    ```
    git checkout -b <branch name>
    ```

5.	Bump the version, create a commit and a tag.<br>
    Run [npm version](https://docs.npmjs.com/cli/version) with a commit message according to the Semantic Versioning section.
    <br><br>Example:

    ```
    npm version patch -m "feat: new release version %s"
    ```
    
    Note: If `npm run ci` fail you cannot create a release.<br>
    Note: If the have modified files in your branch you cannot create a release.

6.	Push the commit and the tag to the remote branch
    ```
    git push --follow-tags origin <branch name>
    ```

7. Create a pull request on GitHub

8. On GitHub, make sure all jobs including the `deploy to npm`  pass and merge to master

9. Update the [CHANGELOG.md](https://github.com/SAP/feature-toggle-node/blob/master/CHANGELOG.md) file
