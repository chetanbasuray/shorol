# AGENTS.md

Guidance for AI agents (and humans) contributing to **shorol**, a zero-dependency,
fluent, human-readable regex builder for JavaScript/TypeScript.

Read this before opening a PR. The rules here are what the release pipeline enforces,
so following them is what gets your change merged and released cleanly.

## Golden rules

1. **Commits follow [Conventional Commits](https://www.conventionalcommits.org/).** The
   commit type decides the version bump, so it is not cosmetic. `commitlint` runs on every
   PR and rejects non-conforming commits.
2. **Releases are automatic on merge to `main`.** Merging a PR that contains a releasing
   commit publishes a new version to npm and creates a GitHub release/tag. There is no
   manual step, so get the commit type right.
3. **Never hand-edit the version or changelog.** `package.json` `version` and `CHANGELOG.md`
   are owned by `semantic-release`. Do not bump them in a PR.
4. **Keep it zero-dependency at runtime.** No `dependencies` in `package.json`. Dev
   dependencies are fine.
5. **Tests and types must stay green.** Coverage is enforced at 100% and TypeScript runs in
   `strict` mode. A change that drops either will fail CI.

## Commit type → release effect

| Type | Example | Release |
|---|---|---|
| `feat:` | `feat: add oneOf() builder method` | **minor** (x.Y.0) |
| `fix:` | `fix: escape metacharacters in range bounds` | **patch** (x.y.Z) |
| `feat!:` or any type with a `BREAKING CHANGE:` footer | `feat!: change or() alternation scope` | **major** (X.0.0) |
| `docs:` | `docs: clarify lazy quantifier usage` | none |
| `ci:` | `ci: run release on merge to main` | none |
| `chore:` | `chore(deps-dev): bump vitest` | none |
| `test:` | `test: add property tests for backreferences` | none |
| `refactor:` / `style:` | `refactor: extract quantifier guard` | none |
| `perf:` | `perf: avoid regex recompile` | none (configured off) |
| `revert:` | `revert: ...` | none (configured off) |

Breaking changes are **major** and go to the 2.x+ line. "Breaking" means a change that could
alter the result of code a user already wrote: rejecting input that previously produced a
pattern, changing an emitted pattern string / exported value for a valid chain, or changing a
public type non-additively. If in doubt, it is breaking.

## Branch naming

PRs to `main` must come from one of these prefixes (enforced by the Merge Policy workflow):

`release/*`, `hotfix/*`, `dependabot/*`, `fix/*`, `bugfix/*`, `chore/*`, `feat/*`, `docs/*`

## Pull request requirements

- All status checks must pass: `Lint`, `CI` (Node 20 and 22), `Code Coverage`, `Doc Sync`,
  `Commitlint (PR)`, `CVE Check`, `Merge Policy`.
- Update tests for any behavior change; keep coverage at 100%.
- Keep public API docs in sync (`docs:sync` checks `docs/api-signatures.md` against `src/`).
- Do not enable auto-merge.

## Local development

```bash
npm install
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest run
npm run test:coverage
npm run build        # tsup (esm + cjs + d.ts)
npm run docs:sync    # verify docs/api-signatures.md matches src/
```

## Project constraints

- **Runtime:** zero dependencies; Node `>=18`; ships ESM + CJS + type declarations.
- **Source of truth for versioning:** git tags (via `semantic-release`), not `package.json`.
- **Scope:** a readable regex builder. New builder methods are welcome as `feat:`; keep the
  emitted patterns correct and the output readable.
