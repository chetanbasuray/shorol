# Feature Plan / Roadmap

This document tracks Shorol's planned features and improvement ideas by release bucket and theme.

## 1.4.x (near-term, additive)

**Milestone**: Due 2026-05-02 — Near-term additive improvements to the builder, docs, and registry examples.

### Builder API & DSL
- Add `flags()` convenience methods (`global`, `ignoreCase`, `multiline`, `dotAll`, `unicode`).

### Presets / Registry
- Add example: UUID builder pattern (docs-only, beginner-friendly).

### DX / Docs / Tooling
- Add `noneOf()` / `range()` doc examples in README + `docs/llms.txt`.
- Add builder examples for lookarounds + named groups in docs.
- Add `regexRegistry` docs for extending patterns.

## 1.5.x (medium-term)

**Milestone**: Due 2026-06-21 — Medium-term preset module and validation improvements.

### Presets / Registry
- Preset module design: `shorol/presets` (scoped patterns).
- Add `uuidPatternBasic` preset (explicit scope).
- Add `hexColorPattern` preset (explicit scope).

### Validation / Error Handling
- Error messaging improvements for invalid group names.

### DX / Docs / Tooling
- Add contributor guide section: “How to add presets safely”.

## 1.6.x (near-term)

**Milestone**: Due 2026-05-09 — Near-term ergonomics and docs improvements.

### Builder API & DSL
- Add word boundary helpers (`wordBoundary`, `nonWordBoundary`).
- Add line break and tab helpers (`lineBreak`, `tab`).
- Add `letter()` helper for `[a-zA-Z]`.
- Add `space()` helper for literal spaces.
- Add `matches(input: string)` helper for quick checks.

### DX / Docs / Tooling
- Add presets usage + scope disclaimer to README and `docs/llms.txt`.
- Add preset test case template snippet to README.

## 1.7.x (medium-term)

**Milestone**: Due 2026-06-28 — Scoped preset expansion and contributor DX.

### Presets / Registry
- Add `isoDatePatternBasic` preset (YYYY-MM-DD, scoped).
- Add `usernamePatternBasic` preset (3–30, alnum+underscore).

### DX / Docs / Tooling
- Add a preset test template to `docs/PRESETS_GUIDE.md`.
- Export `escapeLiteral` helper for reuse (documented).

## 1.8.x (later 1.x)

**Milestone**: Due 2026-09-28 — Builder polish and validation hardening.

### Builder API & DSL
- Add repeat aliases (`exactly`, `between`).

### Validation / Error Handling
- Validate `flags()` input for invalid or duplicate flags.

## 2.x (larger scope)

**Milestone**: Due 2026-09-21 — Larger-scope 2.x work: extensibility, AST, and policy/migration docs.

### Builder API & DSL
- Optional AST output for builder (pattern introspection).
- Builder plugin hooks / custom tokens API.

### Presets / Registry
- Preset validation policy & test matrix (locale-dependent).

### DX / Docs / Tooling
- Structured migration guide for 2.x.

## Contributing new ideas

- Open an issue with a short proposal and examples.
- Keep additions small and composable.
- Prefer features that improve readability or safety.
