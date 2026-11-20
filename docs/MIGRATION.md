# Migration Guide: 2.x to 3.x

Version 3.0.0 fixes builder bugs that silently produced the wrong pattern. Each fix changes the result of some chains that 2.x accepted, so per the [versioning policy](../FEATURES.md#versioning-policy) they ship together as a major release. If your code does not hit one of the paths below, no changes are needed.

## The `u` flag is added wherever the pattern needs it

In 2.x, `unicodeProperty()` added the `u` flag only to the builder it was called on, so it was lost in three cases:

- inside `group`, `namedGroup`, `nonCapture`, the lookarounds, `or()` and `oneOf()`;
- after `flags(...)`, which replaced the stored flags;
- when a `flags` argument was passed to `toRegExp`, `matches`, `exec`, `match`, `matchAll`, `replace`, `replaceAll` or `split`.

Without `u`, JavaScript reads `\p{L}` as the literal text `p{L}`. `anyOf`, `noneOf` and `range` with characters above U+FFFF (emoji, for example) also never added `u`, so the class was split into surrogate halves.

In 3.x, the builder remembers that the pattern needs unicode mode and adds `u` to whatever flags are used, unless they already contain `u` or `v`.

```ts
// 2.x: flags "", matches the text "p{L}" but not "x"
// 3.x: flags "u", matches "x"
regex()
  .group((g) => g.unicodeProperty("L"))
  .toRegExp();

// 2.x: flags "g";  3.x: flags "gu"
regex().unicodeProperty("L").flags("g").toRegExp();

// 2.x: throws "Range out of order in character class";  3.x: matches "😁"
regex().range("😀", "😃").toRegExp();
```

Patterns without unicode properties or astral characters are unchanged.

## `range()` checks bound order

In 2.x, `range("z", "a")` was accepted and only failed later, inside `toRegExp()`. In 3.x, `range()` throws straight away.

```ts
// 3.x: throws "range(from, to) requires from to be at or before to"
regex().range("z", "a");
```

---

# Migration Guide: 1.x to 2.x

Version 2.0.0 tightened builder validation and changed some output formatting. All five changes below throw at build time in 2.x where 1.x either allowed the call silently or produced a different string. If your code is not hitting one of these paths, no changes are needed.

## `end()` locks the pattern

In 1.x, calling a builder method after `end()` was allowed. In 2.x it throws, since a token added after the end-of-string anchor was already a bug in the pattern.

```ts
// 1.x: allowed
regex().start().literal("a").end().optional();

// 2.x: throws "Cannot add tokens after end() anchor"
```

Flags are exempt, since they are not pattern tokens:

```ts
// 2.x: still allowed
regex().start().literal("a").end().ignoreCase();
```

If you were relying on this, move the quantifier or token before `end()`.

## `repeat()` requires integer bounds

In 1.x, `repeat(min, max)` accepted non-integer numbers and emitted whatever `{min,max}` string resulted. In 2.x, both bounds must be non-negative integers.

```ts
// 1.x: allowed, emitted "{2.5}"
regex().digit().repeat(2.5);

// 2.x: throws "repeat(min, max) requires min to be a non-negative integer"
```

Round or floor your bounds before calling `repeat()`.

## `range()` requires single-code-point bounds

In 1.x, `range(from, to)` accepted multi-character strings and used them as-is. In 2.x, each bound must be exactly one Unicode code point (checked via spread, so a single astral code point like an emoji is one code point and still valid).

```ts
// 1.x: allowed
regex().range("ab", "z");

// 2.x: throws "range(from, to) requires each bound to be exactly one code point"
```

Pass single characters, or build the range from a character class with `anyOf()` instead.

## Character classes are no longer over-wrapped under quantifiers

In 1.x, a character class under a quantifier was wrapped in a non-capturing group even though the group was redundant. In 2.x, the group is only added when actually needed.

```ts
// 1.x output
regex().anyOf("abc").oneOrMore().toString(); // "(?:[abc])+"

// 2.x output
regex().anyOf("abc").oneOrMore().toString(); // "[abc]+"
```

The two patterns are functionally equivalent, so this only matters if your code snapshot-tests the exact pattern string.

## Nested quantifiers are rejected

In 1.x, applying a quantifier to an already-quantified token was allowed, which is one of the shapes that causes catastrophic backtracking (ReDoS). In 2.x it throws.

```ts
// 1.x: allowed, could produce a ReDoS-prone pattern
regex().digit().oneOrMore().oneOrMore();

// 2.x: throws "Cannot apply quantifier to an already-quantified token.
// Use an explicit group if nesting is intentional."
```

If the nesting was intentional, wrap the inner token in an explicit group first:

```ts
regex()
  .nonCapture((b) => b.digit().oneOrMore())
  .oneOrMore();
```
