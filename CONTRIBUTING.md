# Contributing

Thanks for your interest in contributing!

## How to Contribute

1. Fork the repo and create your branch from `main`.
2. Install dependencies: `npm install`.
3. Make your changes.
4. Run the checks: `npm run test`, `npm run lint`, `npm run typecheck`.
5. Ensure your commits follow Conventional Commits (used for automated releases).
6. Open a pull request with a clear description of the change.

## Development Setup

- Build: `npm run build`
- Watch: `npm run dev`
- Tests: `npm run test`
- Lint: `npm run lint`
- Format: `npm run format`

## Regex Policy

To keep regex readable and centralized, all regex patterns must live in `src/regexes.ts`.

Example:

```ts
import { regex } from "./builder";

export const slugBuilder = () =>
  regex().start().word().oneOrMore().nonCapture((b) => b.literal("-").word().oneOrMore()).zeroOrMore().end();

export const slugPattern = slugBuilder().toString();
export const slugRegex = slugBuilder().toRegExp();
```

### Do / Don’t

| Do | Don’t |
| --- | --- |
| Add new patterns to `src/regexes.ts` | Inline regex literals in feature code |
| Export both `Pattern` and `Regex` | Export only a raw `/.../` regex |
| Use the fluent builder for clarity | Hand-write complex regex strings |

## Reporting Issues

Please include:
- A clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Node.js version and OS

## Code of Conduct

By participating, you are expected to uphold the Code of Conduct. See
`CODE_OF_CONDUCT.md`.
