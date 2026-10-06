# API Signatures (Doc Sync)

This file is used by `doc-sync-check` to detect documentation drift for exported symbols.

## Builder

`class Builder<Groups extends string = never>`
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
`Builder.group(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.hasIndices(): this`
`Builder.namedGroup(name: Name, fn: (b: Builder) => Builder<G>): Builder<Groups | Name | G>`
`Builder.nonCapture(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.lookahead(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.negativeLookahead(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.lookbehind(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.negativeLookbehind(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.oneOf(...alternatives: Array<(b: Builder) => Builder<G>>): Builder<Groups | G>`
`Builder.oneOfLiteral(...alternatives: string[]): Builder<Groups | G>`
`Builder.or(fn: (b: Builder) => Builder<G>): Builder<Groups | G>`
`Builder.orLiteral(text: string): Builder<Groups | G>`
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
`Builder.exec(input: string, flags?: string): TypedExec<Groups> | null`
`Builder.match(input: string, flags?: string): TypedMatch<Groups> | null`
`Builder.matchAll(input: string, flags?: string): TypedMatch<Groups>[]`
`Builder.replace(input: string, replacement: ReplaceValue, flags?: string): string`
`Builder.replaceAll(input: string, replacement: ReplaceValue, flags?: string): string`
`Builder.split(input: string, flags?: string): string[]`
`Builder.clone(): Builder<Groups>`
`Builder.explain(): string`

## Types

`type TypedMatch<G extends string> = Omit<RegExpMatchArray, "groups"> & { groups: GroupRecord<G> }`
`type TypedExec<G extends string> = Omit<RegExpExecArray, "groups"> & { groups: GroupRecord<G> }`

## Builders and Registries

`regex(): Builder<never>`
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
