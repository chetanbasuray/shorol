## [2.1.8](https://github.com/chetanbasuray/shorol/compare/v2.1.7...v2.1.8) (2026-07-15)


### Bug Fixes

* make releases manual and restrict triggers to fix, feat, and breaking changes ([#142](https://github.com/chetanbasuray/shorol/issues/142)) ([1ffa98c](https://github.com/chetanbasuray/shorol/commit/1ffa98c8688195828390c1bea33fedbdcd559b3d))

## [2.1.7](https://github.com/chetanbasuray/shorol/compare/v2.1.6...v2.1.7) (2026-07-15)


### Bug Fixes

* open a manual-merge PR to sync version and changelog after release ([#140](https://github.com/chetanbasuray/shorol/issues/140)) ([4d967b5](https://github.com/chetanbasuray/shorol/commit/4d967b5d8fc24cf3e523f894ae0575b11193d811))

## [2.1.5](https://github.com/chetanbasuray/shorol/compare/v2.1.4...v2.1.5) (2026-06-28)


### Bug Fixes

* remove stale create-release-pr step from release workflow ([#132](https://github.com/chetanbasuray/shorol/issues/132)) ([547def2](https://github.com/chetanbasuray/shorol/commit/547def24b757a2dff30dd62572987bc7cad36693))

## [2.1.4](https://github.com/chetanbasuray/shorol/compare/v2.1.3...v2.1.4) (2026-06-28)


### Bug Fixes

* enable npm provenance via NPM_CONFIG_PROVENANCE env var ([#131](https://github.com/chetanbasuray/shorol/issues/131)) ([e758d44](https://github.com/chetanbasuray/shorol/commit/e758d44bd3e66aecb5032686d266fe14398fc480))

## [2.1.3](https://github.com/chetanbasuray/shorol/compare/v2.1.2...v2.1.3) (2026-06-28)


### Bug Fixes

* configure git identity in release workflow before commit ([#130](https://github.com/chetanbasuray/shorol/issues/130)) ([006916b](https://github.com/chetanbasuray/shorol/commit/006916b3ae6cd02a0e140b6a5c59f403d0e87cfb))

## [2.1.2](https://github.com/chetanbasuray/shorol/compare/v2.1.1...v2.1.2) (2026-06-28)


### Bug Fixes

* include README.md in npm package files ([75f5644](https://github.com/chetanbasuray/shorol/commit/75f56448a6dcfdd8cc4b87339e823c35262741a5))

## [2.1.1](https://github.com/chetanbasuray/shorol/compare/v2.1.0...v2.1.1) (2026-06-28)


### Bug Fixes

* allow fix, bugfix, chore, feat branch prefixes in merge policy ([02ba315](https://github.com/chetanbasuray/shorol/commit/02ba31547bb45e41818b58b51590494bf37deac8))

# [2.1.0](https://github.com/chetanbasuray/shorol/compare/v2.0.3...v2.1.0) (2026-06-28)


### Features

* auto-close dependabot PRs less than 2 weeks old ([2259577](https://github.com/chetanbasuray/shorol/commit/225957756ac822e8cfe2cd7fb5b6bb749cec61d1))

## [2.0.3](https://github.com/chetanbasuray/shorol/compare/v2.0.2...v2.0.3) (2026-06-21)


### Bug Fixes

* disable body-max-line-length rule for dependabot commits ([3336a2e](https://github.com/chetanbasuray/shorol/commit/3336a2eb9068f2a0e148a6d15ee03767f08ad782))

## [2.0.2](https://github.com/chetanbasuray/shorol/compare/v2.0.1...v2.0.2) (2026-06-21)


### Bug Fixes

* allow dependabot branches in merge policy ([#120](https://github.com/chetanbasuray/shorol/issues/120)) ([b9810d4](https://github.com/chetanbasuray/shorol/commit/b9810d464f5686b889007282e13b673db1c7a4a6))

## [2.0.1](https://github.com/chetanbasuray/shorol/compare/v2.0.0...v2.0.1) (2026-06-18)


### Bug Fixes

* check git diff instead of tag existence in release PR step ([d9ba3bb](https://github.com/chetanbasuray/shorol/commit/d9ba3bb2d6f9aa9207814f2c6f72b769acf358da))

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
