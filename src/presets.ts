import { regex } from "./builder";

/**
 * shorol/presets
 *
 * Scoped, opinionated regex presets for common validation scenarios.
 *
 * These patterns are maintained as a separate module to keep the core
 * builder API minimal and to provide an explicit scope for convenience
 * use cases. Import from `shorol/presets` for best clarity in code.
 */

const HEX_CHARS = "0123456789abcdefABCDEF";

/** Basic UUID v4 pattern (case-insensitive). */
export const uuidBasicBuilder = () =>
  regex()
    .start()
    .anyOf("0123456789abcdef").repeat(8)
    .literal("-")
    .anyOf("0123456789abcdef").repeat(4)
    .literal("-")
    .literal("4")
    .anyOf("0123456789abcdef").repeat(3)
    .literal("-")
    .anyOf("89ab").anyOf("0123456789abcdef").repeat(3)
    .literal("-")
    .anyOf("0123456789abcdef").repeat(12)
    .end();

export const uuidPatternBasic = uuidBasicBuilder().toString();
export const uuidRegexBasic = uuidBasicBuilder().toRegExp("i");

/** Basic hex color pattern (allows optional leading # and shorthand or full form). */
export const hexColorBuilder = () =>
  regex()
    .start()
    .literal("#").optional()
    .nonCapture((b) =>
      b
        .anyOf(HEX_CHARS)
        .repeat(3)
        .or((b2) => b2.anyOf(HEX_CHARS).repeat(6))
    )
    .end();

export const hexColorPattern = hexColorBuilder().toString();
export const hexColorRegex = hexColorBuilder().toRegExp();

/** Registry helpers for full module discovery. */
export const presetsRegistry = {
  uuidBasicBuilder,
  uuidPatternBasic,
  uuidRegexBasic,
  hexColorBuilder,
  hexColorPattern,
  hexColorRegex
};
