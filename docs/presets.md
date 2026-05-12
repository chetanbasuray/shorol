# Presets Index

This index lists built-in presets, scope, and example usage.

## Scope Note

Presets in shorol are scoped, best-effort patterns. They are intended for readability and common matching flows, not full domain validation.

## UUID v4 (basic)

- Exports: `uuidPatternBasic`, `uuidRegexBasic`
- Scope: canonical UUID v4 shape with hex segments and version/variant checks.
- Not in scope: semantic checks outside the UUID format.

```ts
import { uuidRegexBasic } from "shorol/presets";

uuidRegexBasic.test("f47ac10b-58cc-4372-a567-0e02b2c3d479"); // true
```

## Hex Color (basic)

- Exports: `hexColorPattern`, `hexColorRegex`
- Scope: 3- or 6-digit hex colors, optional leading `#`.
- Not in scope: CSS color keywords and alpha formats.

```ts
import { hexColorRegex } from "shorol/presets";

hexColorRegex.test("#fff"); // true
hexColorRegex.test("336699"); // true
```

## ISO Date (basic)

- Exports: `isoDatePatternBasic`, `isoDateRegexBasic`
- Scope: `YYYY-MM-DD` shape.
- Not in scope: calendar validity (e.g., leap-year/day checks).

```ts
import { isoDateRegexBasic } from "shorol/presets";

isoDateRegexBasic.test("2026-05-10"); // true
```

## Username (basic)

- Exports: `usernamePatternBasic`, `usernameRegexBasic`
- Scope: 3 to 30 characters, ASCII alphanumeric plus underscore.
- Not in scope: locale-specific usernames or reserved-word checks.

```ts
import { usernameRegexBasic } from "shorol/presets";

usernameRegexBasic.test("user_name_123"); // true
```
