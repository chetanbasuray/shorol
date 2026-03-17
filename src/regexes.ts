import { regex } from "./builder";

// Naming convention: <name>Builder (factory), <name>Pattern (string), <name>Regex (RegExp)

export const slugBuilder = () =>
  regex()
    .start()
    .word()
    .oneOrMore()
    .nonCapture((b) => b.literal("-").word().oneOrMore())
    .zeroOrMore()
    .end();

export const slugPattern = slugBuilder().toString();
export const slugRegex = slugBuilder().toRegExp();

export const identifierBuilder = () => regex().start().word().oneOrMore().end();
export const identifierPattern = identifierBuilder().toString();
export const identifierRegex = identifierBuilder().toRegExp();

export const regexRegistry = {
  slugBuilder,
  slugPattern,
  slugRegex,
  identifierBuilder,
  identifierPattern,
  identifierRegex
};
