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
