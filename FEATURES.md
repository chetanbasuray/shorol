# Feature Plan / Roadmap

This document tracks Shorol's planned features and improvement ideas by release bucket and theme.

## 1.4.x (near-term, additive)

### Builder API & DSL
- Add `flags()` convenience methods (`global`, `ignoreCase`, `multiline`, `dotAll`, `unicode`).

### Presets / Registry
- Add example: UUID builder pattern (docs-only, beginner-friendly).

### DX / Docs / Tooling
- Add `noneOf()` / `range()` doc examples in README + `docs/llms.txt`.
- Add builder examples for lookarounds + named groups in docs.
- Add `regexRegistry` docs for extending patterns.

## 1.5.x (medium-term)

### Presets / Registry
- Preset module design: `shorol/presets` (scoped patterns).
- Add `uuidPatternBasic` preset (explicit scope).
- Add `hexColorPattern` preset (explicit scope).

### Validation / Error Handling
- Error messaging improvements for invalid group names.

### DX / Docs / Tooling
- Add contributor guide section: “How to add presets safely”.

## 2.x (larger scope)

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
