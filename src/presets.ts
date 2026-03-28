import { regex } from "./builder";

const HEX_CHARS = "0123456789abcdefABCDEF";

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

export const hexColorPattern = regex()
  .start()
  .literal("#")
  .optional()
  .nonCapture((b) => b.anyOf(HEX_CHARS).repeat(3).or((o) => o.anyOf(HEX_CHARS).repeat(6)))
  .end()
  .toString();

export const hexColorRegex = new RegExp(hexColorPattern);

export const presetsRegistry = {
  uuidPatternBasic,
  uuidRegexBasic,
  hexColorPattern,
  hexColorRegex
};
