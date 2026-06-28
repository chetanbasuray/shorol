## [2.1.3](https://github.com/chetanbasuray/shorol/compare/v2.1.2...v2.1.3) (2026-06-28)


### Bug Fixes

* configure git identity in release workflow before commit ([#130](https://github.com/chetanbasuray/shorol/issues/130)) ([006916b](https://github.com/chetanbasuray/shorol/commit/006916b3ae6cd02a0e140b6a5c59f403d0e87cfb))

# [2.0.0](https://github.com/chetanbasuray/shorol/compare/v1.8.2...v2.0.0) (2026-06-18)


### Bug Fixes

* add docs to npm package files and harden CI ([598e9c7](https://github.com/chetanbasuray/shorol/commit/598e9c721cbed1ceda60eb278dcb3bcaadca8566))


* feat!: harden builder validation and emit cleaner char-class patterns ([6ad4ca5](https://github.com/chetanbasuray/shorol/commit/6ad4ca5520b396710935ca0fab58f73e15a8d123))


### Features

* use PR-based release instead of direct push to main ([8b4f116](https://github.com/chetanbasuray/shorol/commit/8b4f116466dcaf9e8032070df3e4922ccce64600))


### BREAKING CHANGES

* Multiple validation tightenings and output changes:

- end() now locks pattern mutation: applyQuantifier and or() throw
  after end() anchor (flags remain settable)
- repeat() rejects non-integer min/max (Number.isInteger)
- range() rejects multi-code-point bounds; each bound must be exactly
  one Unicode code point (spread-based, astral-safe)
- Character classes ([...], [^...]) no longer wrapped in unnecessary
  (?:...) groups under quantifiers (e.g. [abc]+ instead of (?:[abc])+)
- Nested quantifiers (ReDoS shapes) are rejected at build time with a
  clear error suggesting explicit grouping

## [1.1.2](https://github.com/chetanbasuray/shorol/compare/v1.1.1...v1.1.2) (2026-03-17)


### Bug Fixes

* trigger release pipeline ([#12](https://github.com/chetanbasuray/shorol/issues/12)) ([b71c7bb](https://github.com/chetanbasuray/shorol/commit/b71c7bba5d0e7be434984bc35d503209b3b8f943))

## [1.1.1](https://github.com/chetanbasuray/shorol/compare/v1.1.0...v1.1.1) (2026-03-17)


### Bug Fixes

* release issues ([#10](https://github.com/chetanbasuray/shorol/issues/10)) ([8899b81](https://github.com/chetanbasuray/shorol/commit/8899b81faaf3c602f2588c860e35189ce1f532e2))

# [1.1.0](https://github.com/chetanbasuray/shorol/compare/v1.0.0...v1.1.0) (2026-03-17)


### Features

* add fluent regex builder v0.1 ([#9](https://github.com/chetanbasuray/shorol/issues/9)) ([706ca01](https://github.com/chetanbasuray/shorol/commit/706ca016a81dd627e316041320eca8c4f1b9977d))

# 1.0.0 (2026-03-17)


### Features

* initial set up ([a5ac76b](https://github.com/chetanbasuray/shorol/commit/a5ac76ba99db547ae1341e3fce6b758f8770dac5))

# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- Initial scaffolding
