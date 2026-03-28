# Presets Guide (Contributor)

Presets are **scoped, best-effort** patterns for common formats. They are not strict validators and must be labeled accordingly.

## Naming & Scope

- Use explicit scope in names: `uuidPatternBasic`, `hexColorPattern`.
- Avoid implying full validation unless you can prove it.
- Document what the preset does *and does not* validate.

## Implementation Checklist

- Implement the preset in `src/presets.ts` using the builder.
- Export both `Pattern` (string) and `Regex` variants.
- Add tests for **valid and invalid** examples in `src/presets.test.ts`.
- Keep the preset registry updated with new exports.

## Example (Pattern + Regex)

```ts
export const uuidPatternBasic = regex()
  .start()
  .anyOf(HEX_CHARS).repeat(8)
  .literal("-")
  .anyOf(HEX_CHARS).repeat(4)
  .literal("-")
  .literal("4")
  .anyOf(HEX_CHARS).repeat(3)
  .literal("-")
  .anyOf("89abAB").anyOf(HEX_CHARS).repeat(3)
  .literal("-")
  .anyOf(HEX_CHARS).repeat(12)
  .end()
  .toString();

export const uuidRegexBasic = new RegExp(uuidPatternBasic);
```

## Tests (Minimum)

- At least 2–3 valid examples.
- At least 2–3 invalid examples.
- Include edge cases that are commonly mis‑classified.
