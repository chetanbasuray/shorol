import { regex } from "./builder";

const HEX_CHARS = "0123456789abcdefABCDEF";

/**
 * UUID (v4) pattern string.
 * @example
 * ```ts
 * const uuidPatternBasic = regex() .start() .anyOf(HEX_CHARS) .repeat(8) .literal("-") .anyOf(HEX_CHARS) .repeat(4) .literal("-") .literal("4") .anyOf(HEX_CHARS) .repeat(3) .literal("-") .anyOf("89abAB") .anyOf(HEX_CHARS) .repeat(3) .literal("-") .anyOf(HEX_CHARS) .repeat(12) .end() .toString()
 * ```
 */
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

/**
 * UUID (v4) RegExp instance.
 * @example
 * ```ts
 * const uuidRegexBasic = new RegExp(uuidPatternBasic)
 * ```
 */
export const uuidRegexBasic = new RegExp(uuidPatternBasic);

/**
 * Hex color pattern string.
 * @example
 * ```ts
 * const hexColorPattern = regex() .start() .literal("#") .optional() .nonCapture((b) => b.anyOf(HEX_CHARS).repeat(3).or((o) => o.anyOf(HEX_CHARS).repeat(6))) .end() .toString()
 * ```
 */
export const hexColorPattern = regex()
  .start()
  .literal("#")
  .optional()
  .nonCapture((b) => b.anyOf(HEX_CHARS).repeat(3).or((o) => o.anyOf(HEX_CHARS).repeat(6)))
  .end()
  .toString();

/**
 * Hex color RegExp instance.
 * @example
 * ```ts
 * const hexColorRegex = new RegExp(hexColorPattern)
 * ```
 */
export const hexColorRegex = new RegExp(hexColorPattern);

/**
 * ISO date (basic) pattern string.
 * @example
 * ```ts
 * const isoDatePatternBasic = regex() .start() .digit() .repeat(4) .literal("-") .digit() .repeat(2) .literal("-") .digit() .repeat(2) .end() .toString()
 * ```
 */
export const isoDatePatternBasic = regex()
  .start()
  .digit()
  .repeat(4)
  .literal("-")
  .digit()
  .repeat(2)
  .literal("-")
  .digit()
  .repeat(2)
  .end()
  .toString();

/**
 * ISO date (basic) RegExp instance.
 * @example
 * ```ts
 * const isoDateRegexBasic = new RegExp(isoDatePatternBasic)
 * ```
 */
export const isoDateRegexBasic = new RegExp(isoDatePatternBasic);

/**
 * Username pattern string.
 * @example
 * ```ts
 * const usernamePatternBasic = regex() .start() .anyOf("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_") .repeat(3, 30) .end() .toString()
 * ```
 */
export const usernamePatternBasic = regex()
  .start()
  .anyOf("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_")
  .repeat(3, 30)
  .end()
  .toString();

/**
 * Username RegExp instance.
 * @example
 * ```ts
 * const usernameRegexBasic = new RegExp(usernamePatternBasic)
 * ```
 */
export const usernameRegexBasic = new RegExp(usernamePatternBasic);

/**
 * Registry of pattern strings and RegExp instances.
 * @example
 * ```ts
 * const presetsRegistry = { uuidPatternBasic, uuidRegexBasic, hexColorPattern, hexColorRegex, isoDatePatternBasic, isoDateRegexBasic, usernamePatternBasic, usernameRegexBasic }
 * ```
 */
export const presetsRegistry = {
  uuidPatternBasic,
  uuidRegexBasic,
  hexColorPattern,
  hexColorRegex,
  isoDatePatternBasic,
  isoDateRegexBasic,
  usernamePatternBasic,
  usernameRegexBasic
};
