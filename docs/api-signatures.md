# API Signatures (Doc Sync)

This file is used by `doc-sync-check` to detect documentation drift for exported symbols.

## Builder

`class Builder`
`Builder.start(): this`
`Builder.end(): this`
`Builder.lazy(): this`
`Builder.literal(text: string): this`
`Builder.anyOf(chars: string | string[]): this`
`Builder.noneOf(chars: string | string[]): this`
`Builder.range(from: string, to: string): this`
`Builder.raw(str: string): this`
`Builder.any(): this`
`Builder.backreference(ref: number | string): this`
`Builder.digit(): this`
`Builder.word(): this`
`Builder.wordBoundary(): this`
`Builder.nonWordBoundary(): this`
`Builder.letter(): this`
`Builder.whitespace(): this`
`Builder.space(): this`
`Builder.lineBreak(): this`
`Builder.tab(): this`
`Builder.group(fn: BuildFn): this`
`Builder.hasIndices(): this`
`Builder.namedGroup(name: string, fn: BuildFn): this`
`Builder.nonCapture(fn: BuildFn): this`
`Builder.lookahead(fn: BuildFn): this`
`Builder.negativeLookahead(fn: BuildFn): this`
`Builder.lookbehind(fn: BuildFn): this`
`Builder.negativeLookbehind(fn: BuildFn): this`
`Builder.oneOf(...alternatives: BuildFn[]): this`
`Builder.oneOfLiteral(...alternatives: string[]): this`
`Builder.or(fn: BuildFn): this`
`Builder.orLiteral(text: string): this`
`Builder.optional(): this`
`Builder.zeroOrMore(): this`
`Builder.oneOrMore(): this`
`Builder.repeat(min: number, max?: number): this`
`Builder.exactly(count: number): this`
`Builder.between(min: number, max: number): this`
`Builder.flags(flags: string): this`
`Builder.global(): this`
`Builder.ignoreCase(): this`
`Builder.multiline(): this`
`Builder.dotAll(): this`
`Builder.unicode(): this`
`Builder.unicodeProperty(name: string, value?: string): this`
`Builder.toString(): string`
`Builder.toRegExp(flags?: string): RegExp`
`Builder.matches(input: string, flags?: string): boolean`
`Builder.clone(): Builder`

## Builders and Registries

`regex(): Builder`
`escapeLiteral(input: string): string`
`const slugBuilder`
`const slugPattern`
`const slugRegex`
`const identifierBuilder`
`const identifierPattern`
`const identifierRegex`
`const regexRegistry`
`const uuidPatternBasic`
`const uuidRegexBasic`
`const hexColorPattern`
`const hexColorRegex`
`const isoDatePatternBasic`
`const isoDateRegexBasic`
`const usernamePatternBasic`
`const usernameRegexBasic`
`const presetsRegistry`

## Preset Full Signatures

`const slugBuilder = () => regex() .start() .word() .oneOrMore() .nonCapture((b) => b.literal("-").word().oneOrMore()) .zeroOrMore() .end()`
`const slugPattern = slugBuilder().toString()`
`const slugRegex = slugBuilder().toRegExp()`
`const identifierBuilder = () => regex().start().word().oneOrMore().end()`
`const identifierPattern = identifierBuilder().toString()`
`const identifierRegex = identifierBuilder().toRegExp()`
`const regexRegistry = { slugBuilder, slugPattern, slugRegex, identifierBuilder, identifierPattern, identifierRegex }`
`const uuidPatternBasic = regex() .start() .anyOf(HEX_CHARS) .repeat(8) .literal("-") .anyOf(HEX_CHARS) .repeat(4) .literal("-") .literal("4") .anyOf(HEX_CHARS) .repeat(3) .literal("-") .anyOf("89abAB") .anyOf(HEX_CHARS) .repeat(3) .literal("-") .anyOf(HEX_CHARS) .repeat(12) .end() .toString()`
`const uuidRegexBasic = new RegExp(uuidPatternBasic)`
`const hexColorPattern = regex() .start() .literal("#") .optional() .nonCapture((b) => b.anyOf(HEX_CHARS).repeat(3).or((o) => o.anyOf(HEX_CHARS).repeat(6))) .end() .toString()`
`const hexColorRegex = new RegExp(hexColorPattern)`
`const isoDatePatternBasic = regex() .start() .digit() .repeat(4) .literal("-") .digit() .repeat(2) .literal("-") .digit() .repeat(2) .end() .toString()`
`const isoDateRegexBasic = new RegExp(isoDatePatternBasic)`
`const usernamePatternBasic = regex() .start() .anyOf("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_") .repeat(3, 30) .end() .toString()`
`const usernameRegexBasic = new RegExp(usernamePatternBasic)`
`const presetsRegistry = { uuidPatternBasic, uuidRegexBasic, hexColorPattern, hexColorRegex, isoDatePatternBasic, isoDateRegexBasic, usernamePatternBasic, usernameRegexBasic }`
