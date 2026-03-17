# shorol

[![CI](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml/badge.svg)](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/shorol.svg)](https://www.npmjs.com/package/shorol)

Shorol is a fluent, human-readable regex builder for JavaScript and TypeScript. It helps teams and AI agents
generate regex that stays readable in code review, centralizes patterns in one place, and exports both pattern
strings and `RegExp` objects for practical use.

## Install

```bash
npm install shorol
```

## Usage

### Simple literal

```ts
import { regex } from "shorol";

const pattern = regex().start().literal("cat").end();
const re = pattern.toRegExp();
```

### Groups and quantifiers

```ts
const re = regex()
  .group((b) => b.literal("cat").orLiteral("dog"))
  .whitespace()
  .word()
  .oneOrMore()
  .toRegExp("i");
```

### Alternation

```ts
const pattern = regex().literal("yes").orLiteral("no").toString();
```

### Central regex registry

```ts
import { slugRegex, identifierPattern } from "shorol";

slugRegex.test("my-post-slug"); // true
const identifier = new RegExp(identifierPattern);
```

## API

### Entry

- `regex(): Builder`

### Builder

- `start()` / `end()`
- `literal(text: string)`
- `any()` / `digit()` / `word()` / `whitespace()`
- `group(fn)` / `nonCapture(fn)`
- `or(fn)` / `orLiteral(text)`
- `optional()` / `zeroOrMore()` / `oneOrMore()` / `repeat(min, max?)`
- `toString()` / `toRegExp(flags?)`

## AI & Contributor Guidance

Shorol is designed to keep regex readable for humans. To make AI- and human-generated regex easy to review:

- Put all regex definitions in `src/regexes.ts`.
- Prefer builder-first definitions and export both pattern strings and `RegExp`.
- Avoid inline regex literals in app code.

Example registry entry:

```ts
export const slugBuilder = () =>
  regex()
    .start()
    .word()
    .oneOrMore()
    .nonCapture((b) => b.literal("-").word().oneOrMore())
    .zeroOrMore()
    .end();

export const slugPattern = slugBuilder().toString();
export const slugRegex = slugBuilder().toRegExp();
```

## Project Links

- [License](LICENSE)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Feature Plan](FEATURES.md)

## Release Process

Releases are automated via GitHub Actions and semantic-release on merges to `main`.
Use Conventional Commit titles (e.g., `feat:` or `fix:`) on merge commits to trigger releases.

## License

MIT. See `LICENSE`.
