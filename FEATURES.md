# Feature Plan

This document tracks Shorol's planned features and improvement ideas.

## v0.1 (current)

- Fluent builder core
- Literal escaping
- Basic tokens (`any`, `digit`, `word`, `whitespace`)
- Anchors (`start`, `end`)
- Groups (capture, non-capture)
- Alternation (`or`, `orLiteral`)
- Quantifiers (`optional`, `zeroOrMore`, `oneOrMore`, `repeat`)
- String and `RegExp` output

## v0.2+ ideas

- Character class builder (`anyOf`, `noneOf`, `range`)
- Named capture groups
- Lookarounds (positive/negative lookahead, lookbehind)
- Flags builder (`global`, `ignoreCase`, `multiline`, `dotAll`, `unicode`)
- Comments mode / free-spacing mode
- Predefined presets (email, URL, UUID)
- Better error messages and validation

## Contributing new ideas

- Open an issue with a short proposal and examples.
- Keep additions small and composable.
- Prefer features that improve readability or safety.
