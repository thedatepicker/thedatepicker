Build changes:
- `sh c`

Release new version:
- `npm version <type>` type = `patch` | `minor` | `major` (tag is automatically created)
- `git push`
- `git push --tags`
- `npm login` (optionally)
- `npm publish`
- create new release on GitHub: https://github.com/thedatepicker/thedatepicker/releases/new
