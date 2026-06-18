# Feature Plan / Roadmap

This document tracks Shorol's planned features and improvement ideas by release bucket and theme.

## Versioning Policy

A change is **BREAKING** if it could alter the result of code a user already wrote. For this library that explicitly includes:

- Rejecting input that previously produced a pattern (tightening any validation so a previously-accepted chain now throws).
- Changing the emitted pattern string for a valid chain, or changing any exported `*Pattern` / `*Regex` value, even if the compiled RegExp is behaviorally equivalent.
- Renaming/removing a public method, or changing public TypeScript types non-additively.

There is no patch/minor carve-out for "it was invalid anyway." If it is breaking, it goes to the `2.0.0` (`2.x`) line. Additive → minor. True fix with no API/output change → patch.

Each item below is tagged with its semver impact: `[major]`, `[minor]`, or `[patch]`.

---

## Shipped

Items already released with their version.

### 1.7.0
- `[minor]` Add `wordBoundary`, `nonWordBoundary` helpers.
- `[minor]` Add `lineBreak`, `tab` helpers.
- `[minor]` Add `letter()` helper for `[a-zA-Z]`.
- `[minor]` Add `space()` helper for literal spaces.
- `[minor]` Add `matches(input: string)` helper for quick checks.
- `[minor]` Add `clone()` method for safe branching.
- `[minor]` Add `isoDatePatternBasic` preset.
- `[minor]` Add `usernamePatternBasic` preset.
- `[patch]` Export `escapeLiteral` helper for reuse.

### 1.8.0
- `[minor]` Add repeat aliases (`exactly`, `between`).
- `[minor]` Validate `flags()` input for invalid or duplicate flags.

### 1.8.x (pending patch release)
- `[patch]` Add `docs/` to npm package files so subpath exports resolve.
- `[patch]` CI matrix + `npm ci` hardening.

---

## 1.9.x — Additive features

**Theme:** Feature additions from the former 2.x bucket that are non-breaking.

### Builder API & DSL
- `[minor]` Add `explain()` output for builder chains.
- `[minor]` Optional AST output for builder (pattern introspection).
- `[minor]` Builder plugin hooks / custom tokens API.

### Presets / Registry
- `[minor]` Preset validation policy & test matrix (locale-dependent).

### DX / Docs / Tooling
- `[minor]` Structured migration guide for 2.x.
- `[minor]` Preset scopes + validation policy doc.

---

## 2.0.0 — Breaking changes

**Theme:** Validation hardening, end() lock, and pattern output stability.

### Builder API & DSL
- `[major]` `end()` locks pattern mutation (quantifiers, alternation after `$` throw).
- `[major]` `repeat()` rejects non-integer bounds.
- `[major]` `range()` requires single code-point bounds.
- `[major]` Char classes no longer wrapped in `(?:...)` groups under quantifiers (output change).
- `[major]` Nested quantifiers rejected at build time.
- `[major]` Typed named groups helper (TypeScript) — public type change.

### DX / Docs / Tooling
- `[minor]` Migration guide for 2.0.0 changes.

---

## 2.x (future)

Larger-scope breaking work beyond 2.0.0.

### Builder API & DSL
- `[major]` `or()` → whole-expression alternation (scope change).
- `[major]` Rename `letter()` / `word()` to unicode-aware variants.

---

## Contributing new ideas

- Open an issue with a short proposal and examples.
- Keep additions small and composable.
- Prefer features that improve readability or safety.
- Tag your issue with the semver impact (`[major]`, `[minor]`, `[patch]`) so it can be routed to the correct milestone.
