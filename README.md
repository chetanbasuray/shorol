# shorol

[![CI](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml/badge.svg)](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/shorol.svg)](https://www.npmjs.com/package/shorol)
[![npm downloads](https://img.shields.io/npm/dm/shorol.svg)](https://www.npmjs.com/package/shorol)
[![license](https://img.shields.io/npm/l/shorol.svg)](LICENSE)
[![release](https://img.shields.io/github/v/release/chetanbasuray/shorol.svg)](https://github.com/chetanbasuray/shorol/releases)
[![bundle size](https://img.shields.io/bundlephobia/minzip/shorol.svg)](https://bundlephobia.com/package/shorol)

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

## Registry Helpers (Current)

- `slugBuilder`, `slugPattern`, `slugRegex`
- `identifierBuilder`, `identifierPattern`, `identifierRegex`

## Presets Scope

Presets are scoped, best-effort helpers for common formats. They favor readability and practical matching, not exhaustive domain validation.

- Use `shorol/presets` for common pattern starters.
- Keep strict business validation in app/domain logic.
- See [docs/presets.md](./docs/presets.md) for scope and examples.

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

### Preset test template

Use this format when adding presets to keep tests consistent:

```ts
describe("preset name", () => {
  it("accepts valid inputs", () => {
    expect(presetRegex.test("valid")).toBe(true);
  });

  it("rejects invalid inputs", () => {
    expect(presetRegex.test("invalid")).toBe(false);
  });
});
```

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

### Character classes

```ts
const slug = regex()
  .anyOf("abcdefghijklmnopqrstuvwxyz0123456789")
  .oneOrMore()
  .toRegExp("i");
```

```ts
const noSpaces = regex()
  .start()
  .noneOf(" \t\n\r")
  .oneOrMore()
  .end()
  .toRegExp();
```

```ts
const lowerAZ = regex().range("a", "z").oneOrMore().toRegExp();
```

### Lookarounds and named groups

```ts
const password = regex()
  .lookahead((b) => b.any().oneOrMore().digit())
  .lookahead((b) => b.any().oneOrMore().anyOf("!@#$"))
  .any()
  .oneOrMore()
  .toRegExp();
```

```ts
const quoted = regex()
  .namedGroup("value", (b) => b.noneOf("\"").oneOrMore())
  .toRegExp();
```

### UUID v4 (builder example)

```ts
const uuidV4 = regex()
  .start()
  .anyOf("0123456789abcdef").repeat(8)
  .literal("-")
  .anyOf("0123456789abcdef").repeat(4)
  .literal("-")
  .literal("4")
  .anyOf("0123456789abcdef").repeat(3)
  .literal("-")
  .anyOf("89ab")
  .anyOf("0123456789abcdef").repeat(3)
  .literal("-")
  .anyOf("0123456789abcdef").repeat(12)
  .end()
  .toRegExp("i");
```

## Example Gallery (Recipes)

### Username (3-30, alnum + underscore)

```ts
const username = regex()
  .start()
  .anyOf("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_")
  .repeat(3, 30)
  .end()
  .toRegExp();
```

### ISO Date (basic `YYYY-MM-DD` shape)

```ts
const isoDate = regex()
  .start()
  .digit().repeat(4)
  .literal("-")
  .digit().repeat(2)
  .literal("-")
  .digit().repeat(2)
  .end()
  .toRegExp();
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
- `wordBoundary()` / `nonWordBoundary()`
- `space()` / `lineBreak()` / `tab()`
- `group(fn)` / `namedGroup(name, fn)` / `nonCapture(fn)`
- `lookahead(fn)` / `negativeLookahead(fn)` / `lookbehind(fn)` / `negativeLookbehind(fn)`
- `or(fn)` / `orLiteral(text)`
- `optional()` / `zeroOrMore()` / `oneOrMore()` / `repeat(min, max?)`
- `global()` / `ignoreCase()` / `multiline()` / `dotAll()` / `unicode()`
- `flags(flags: string)` / `toString()` / `toRegExp(flags?)`
- `matches(input: string, flags?: string)`
- `clone()`

## AI & Contributor Guidance

Shorol is designed to keep regex readable for humans. To make AI- and human-generated regex easy to review:

- Put all regex definitions in `src/regexes.ts`.
- Put scoped common-format helpers in `src/presets.ts`.
- Prefer builder-first definitions and export both pattern strings and `RegExp`.
- Avoid inline regex literals in app code.

## Design Rules

- Prefer builder tokens over raw metachar strings in literals.
- Keep patterns centralized in registry/presets modules.
- Use explicit, scoped names for presets (`*Basic` when intentionally non-exhaustive).
- Add valid and invalid test cases for every new exported pattern.

### Adding a registry entry

1. Add a builder function + exports in `src/regexes.ts`.
2. Re-export the new entry from `src/index.ts` if it should be public.
3. Add a small test  in `src/regexes.test.ts`.

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
