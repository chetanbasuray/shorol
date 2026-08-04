# Presets Guide (Contributor)

Presets are **scoped, best-effort** patterns for common formats. They are not strict validators and must be labeled accordingly.

## Naming & Scope

- Use explicit scope in names: `uuidPatternBasic`, `hexColorPattern`.
- Avoid implying full validation unless you can prove it.
- Document what the preset does _and does not_ validate.

## Validation Policy

All `*Basic` presets follow two rules:

- **Shape, not semantics.** A preset checks that input has the right shape, not that it is meaningful. `isoDateRegexBasic` accepts `2026-13-45`, since `13` and `45` are shaped like a month and day; it does not check the calendar. `uuidRegexBasic` accepts any correctly-shaped v4 UUID string; it does not check registry uniqueness.
- **ASCII, not locale-aware.** A preset only accepts the ASCII characters implied by its format (hex digits, ASCII letters/digits/underscore, literal `#`). Full-width digits, accented letters, non-Latin scripts, and other locale-specific variants are rejected, even when they would be a valid representation of the same value in that locale.

Every preset must have tests proving both rules hold, not just documentation claiming they do. See the locale-dependent validation matrix in `src/presets.test.ts` for the pattern to extend when adding a new preset.

## Implementation Checklist

- Implement the preset in `src/presets.ts` using the builder.
- Export both `Pattern` (string) and `Regex` variants.
- Add tests for **valid and invalid** examples in `src/presets.test.ts`.
- Keep the preset registry updated with new exports.

## Example (Pattern + Regex)

```ts
export const uuidPatternBasic = regex()
  .start()
  .anyOf(HEX_CHARS)
  .repeat(8)
  .literal("-")
  .anyOf(HEX_CHARS)
  .repeat(4)
  .literal("-")
  .literal("4")
  .anyOf(HEX_CHARS)
  .repeat(3)
  .literal("-")
  .anyOf("89abAB")
  .anyOf(HEX_CHARS)
  .repeat(3)
  .literal("-")
  .anyOf(HEX_CHARS)
  .repeat(12)
  .end()
  .toString();

export const uuidRegexBasic = new RegExp(uuidPatternBasic);
```

## Tests (Minimum)

- At least 2–3 valid examples.
- At least 2–3 invalid examples.
- Include edge cases that are commonly mis‑classified.

### Preset Test Template

```ts
describe("preset name", () => {
  it("accepts valid inputs", () => {
    expect(presetRegex.test("valid")).toBe(true);
  });

  it("rejects invalid inputs", () => {
    expect(presetRegex.test("invalid")).toBe(false);
  });
});
```
