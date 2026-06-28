import { regex } from "./builder";

// Naming convention: <name>Builder (factory), <name>Pattern (string), <name>Regex (RegExp)

/**
 * Build a slug regex builder, pattern, and RegExp.
 * @example
 * ```ts
 * const slugBuilder = () => regex() .start() .word() .oneOrMore() .nonCapture((b) => b.literal("-").word().oneOrMore()) .zeroOrMore() .end()
 * ```
 */
export const slugBuilder = () =>
  regex()
    .start()
    .word()
    .oneOrMore()
    .nonCapture((b) => b.literal("-").word().oneOrMore())
    .zeroOrMore()
    .end();

/**
 * Slug pattern string.
 * @example
 * ```ts
 * const slugPattern = slugBuilder().toString()
 * ```
 */
export const slugPattern = slugBuilder().toString();
/**
 * Slug RegExp instance.
 * @example
 * ```ts
 * const slugRegex = slugBuilder().toRegExp()
 * ```
 */
export const slugRegex = slugBuilder().toRegExp();

/**
 * Build an identifier regex builder, pattern, and RegExp.
 * @example
 * ```ts
 * const identifierBuilder = () => regex().start().word().oneOrMore().end()
 * ```
 */
export const identifierBuilder = () => regex().start().word().oneOrMore().end();
/**
 * Identifier pattern string.
 * @example
 * ```ts
 * const identifierPattern = identifierBuilder().toString()
 * ```
 */
export const identifierPattern = identifierBuilder().toString();
/**
 * Identifier RegExp instance.
 * @example
 * ```ts
 * const identifierRegex = identifierBuilder().toRegExp()
 * ```
 */
export const identifierRegex = identifierBuilder().toRegExp();

/**
 * Registry of built-in patterns and helpers.
 * @example
 * ```ts
 * const regexRegistry = { slugBuilder, slugPattern, slugRegex, identifierBuilder, identifierPattern, identifierRegex }
 * ```
 */
export const regexRegistry = {
  slugBuilder,
  slugPattern,
  slugRegex,
  identifierBuilder,
  identifierPattern,
  identifierRegex
};
