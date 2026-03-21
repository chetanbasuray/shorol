import { regex } from "./builder";

// Naming convention: <name>Builder (factory), <name>Pattern (string), <name>Regex (RegExp)

/** Build a slug regex builder, pattern, and RegExp. */
export const slugBuilder = () =>
  regex()
    .start()
    .word()
    .oneOrMore()
    .nonCapture((b) => b.literal("-").word().oneOrMore())
    .zeroOrMore()
    .end();

/** Slug pattern string. */
export const slugPattern = slugBuilder().toString();
/** Slug RegExp instance. */
export const slugRegex = slugBuilder().toRegExp();

/** Build an identifier regex builder, pattern, and RegExp. */
export const identifierBuilder = () => regex().start().word().oneOrMore().end();
/** Identifier pattern string. */
export const identifierPattern = identifierBuilder().toString();
/** Identifier RegExp instance. */
export const identifierRegex = identifierBuilder().toRegExp();

/** Registry of built-in patterns and helpers. */
export const regexRegistry = {
  slugBuilder,
  slugPattern,
  slugRegex,
  identifierBuilder,
  identifierPattern,
  identifierRegex
};
