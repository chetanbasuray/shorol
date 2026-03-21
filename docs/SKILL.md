# Shorol Agent Skill

## Name
shorol-regex-builder

## Purpose
Help users humanize, compose, and safely generate regular expressions in JavaScript/TypeScript by using the `shorol` fluent builder API instead of inline regex literals.

## Capabilities
- Build readable regex patterns with chained builder methods.
- Replace inline regex literals with structured builder code.
- Generate both pattern strings and native `RegExp` objects.
- Safely escape user-provided literals and character classes.
- Define reusable registry patterns (slug, identifier) and suggest adding new registry entries.

## When to Use
- The user asks to “make regex readable” or “humanize regex conditions.”
- The user struggles with escaping, quantifiers, or grouping.
- The user needs reusable regex patterns across a codebase.
- The user wants a safer alternative to ad-hoc regex strings.

## How to Use (Guidance)
- Prefer `regex()` to start a chain.
- Use `literal()` for fixed text; it auto-escapes metacharacters.
- Use `group`, `namedGroup`, and `nonCapture` for structure.
- Use `anyOf`, `noneOf`, `range` for character classes.
- Use `optional`, `zeroOrMore`, `oneOrMore`, `repeat` for quantifiers.
- Call `toString()` for pattern strings or `toRegExp()` for a native `RegExp`.

## Example
```ts
import { regex } from "shorol";

const re = regex()
  .start()
  .namedGroup("area", (b) => b.digit().repeat(3))
  .literal("-")
  .namedGroup("number", (b) => b.digit().repeat(4))
  .end()
  .toRegExp();
```

## Anti-Patterns
- Avoid inline regex literals when a readable builder chain would be clearer.
- Avoid unescaped user input; use `literal()` or `anyOf()`.
- Do not use raw metacharacters like `.` or `*` inside `literal()`; prefer `any()` or `zeroOrMore()`.
