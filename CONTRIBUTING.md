# Contributing to `wp-theme-cli`

`wp-theme-cli` package is currently maintained by [Jakub Bazgier](https://github.com/tysian). All feedback and bugs reports are truly appreciated!

## How to Contribute

## Questions and problems

If you have any questions, here are a few quick steps you can make:

1. Read [documentation](https://github.com/tysian/wp-theme-cli/blob/main/README.md)
2. Search through [issues](https://github.com/tysian/wp-theme-cli/issues) or [pull requests](https://github.com/tysian/wp-theme-cli/pulls)

If you didn't find an answer to your question, feel free to create new issue.

## Contributing to repo

### Setup your environment

To contribute, please make sure that you:

1. Forked this repositorium
2. Cloned it to your local machine
3. Have installed [pnpm](https://pnpm.io) globally
   ```bash
   npm install -g pnpm
   ```
4. Have installed all dependencies
   ```bash
   pnpm install
   ```

### Useful commands

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Runs CLI in watch mode                |
| `pnpm build`        | Builds CLI                            |
| `pnpm typecheck`    | Checks your code for typeerrors       |
| `pnpm lint`         | Lints the code                        |
| `pnpm format`       | Formats the code                      |
| `pnpm format:check` | Runs `typecheck`, `lint` and `format` |
| `pnpm lint:fix`     | Lints the code and fixes any errors   |

### Code style

We're trying our best to make our clean and easy to read. We know that this isn't a easy task, also no one is perfect.

This CLI is separated by separate parts called **modules** and it's intentional to make them independent from each other.

If you really need something from any of the existing modules, consider moving it to `/shared` directory and make it more generic.

Each separate piece of code should be put inside its separate function, which is included in separate file with the same name.

It's pretty important to use comments, such as JSDoc or just simple explanations what is going on.

Please follow ESLint rules.

### Commits

Make sure you follow our commit naming guidelines ([convential commit](https://www.conventionalcommits.org/)).

Your commit message should look like this:

```
<type>: <description>
```

Types that can be used: `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

### When you're done

Make sure that your code is formatted correctly and follows project guidelines:

```bash
pnpm format:check
```

Test all features impacted by your change, and do a manual test of all features you've provided. Make sure you didn't break anything 😉.

If your changes the way how CLI works and it should be included in changelog, please run `changeset` command and answer some serious questions about your code.

```bash
pnpm changeset
```

then add changes to git

```bash
git add ./changeset/*.md && git commit -m "chore: add changeset"
```

If everything works, is formatted and linted correctly - it's time to push your changes to the fork and create new pull request.

## Credits

This file was inspired by [create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md) and [contributing.md](https://contributing.md/)
