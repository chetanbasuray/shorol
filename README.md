# shorol

[![CI](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml/badge.svg)](https://github.com/chetanbasuray/shorol/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/shorol.svg)](https://www.npmjs.com/package/shorol)

Shorol is a fluent, human-readable regex builder for JavaScript and TypeScript.

## Install

```bash
npm install shorol
```

## Usage

```ts
import { regex } from "shorol";

const pattern = regex().start().literal("cat").end();
const re = pattern.toRegExp();
```

## API

- `regex(): Builder`

## License

MIT. See `LICENSE`.
