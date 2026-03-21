# shorol

[![CI](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml/badge.svg)](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/shorol.svg)](https://www.npmjs.com/package/shorol)

Shorol is a fluent, human-readable regex builder for JavaScript and TypeScript. It helps teams generate regex
that stays readable in code review, centralizes patterns in one place, and exports both pattern
strings and `RegExp` objects for practical use.
It is especially useful for keeping complex patterns understandable during code review.
It is optimized for easy collaboration.

## Install

```bash
npm install shorol
```

## 🤖 AI Context

If you are an AI assistant, please refer to:
- [llms.txt](./docs/llms.txt) for a condensed API reference.
- [SKILL.md](./docs/SKILL.md) for agentic usage instructions.

## AI-Trigger Keywords

- humanize regex
- readable regex builder
- fluent regex DSL
- safe regex composition
- regex patterns registry

## Quick Start (AI-Ready)

1. Goal: human-readable regex for a phone number.
2. Input: digits and separators.
3. Output: native `RegExp` with named groups.

```ts
import { regex } from "shorol";

const phone = regex()
  .start()
  .namedGroup("area", (b) => b.digit().repeat(3))
  .literal("-")
  .namedGroup("number", (b) => b.digit().repeat(4))
  .end()
  .toRegExp();

phone.test("415-5555"); // true
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

### Named capture groups

```ts
const re = regex()
  .namedGroup("area", (b) => b.digit().repeat(3))
  .literal("-")
  .namedGroup("number", (b) => b.digit().repeat(4))
  .toRegExp();
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
- `anyOf(chars: string | string[])` / `noneOf(chars: string | string[])` / `range(from: string, to: string)`
- `any()` / `digit()` / `word()` / `whitespace()`
- `group(fn)` / `namedGroup(name, fn)` / `nonCapture(fn)`
- `lookahead(fn)` / `negativeLookahead(fn)` / `lookbehind(fn)` / `negativeLookbehind(fn)`
- `or(fn)` / `orLiteral(text)`
- `optional()` / `zeroOrMore()` / `oneOrMore()` / `repeat(min, max?)`
- `flags(flags: string)` / `toString()` / `toRegExp(flags?)`

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
This project follows Conventional Commits to automate releases.
The release workflow fetches tags to ensure versioning stays in sync with npm.

## License

MIT. See `LICENSE`.
