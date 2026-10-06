const META_CHARS = /[.*+?^${}()|[\]\\]/g;
const VALID_FLAGS = "dgimsuy";

type GroupRecord<G extends string> = [G] extends [never] ? undefined : { [K in G]: string };
export type TypedMatch<G extends string> = Omit<RegExpMatchArray, "groups"> & { groups: GroupRecord<G> };
export type TypedExec<G extends string> = Omit<RegExpExecArray, "groups"> & { groups: GroupRecord<G> };

/** String or replacer-function accepted by `String.prototype.replace`. */
type ReplaceValue = string | Parameters<string["replace"]>[1];

/**
 * Escape regex metacharacters in a literal string.
 * Useful when storing or reusing escaped tokens outside the builder.
 */
export function escapeLiteral(input: string): string {
  return input.replace(META_CHARS, "\\$&");
}

function escapeCharClass(input: string): string {
  return input.replace(/[\\\]\-^]/g, "\\$&");
}

function normalizeChars(chars: string | string[]): string {
  if (typeof chars === "string") {
    return chars;
  }
  return chars.join("");
}

function assertValidGroupName(name: string): void {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error(
      "Invalid namedGroup name. Use letters, digits, or underscore and do not start with a digit (e.g. user_id, group1)."
    );
  }
}

function isGroup(token: string): boolean {
  return token.startsWith("(") && token.endsWith(")");
}

function isCharClass(token: string): boolean {
  return token.startsWith("[") && token.endsWith("]");
}

function needsQuantifierGrouping(token: string): boolean {
  if (token.length <= 1) {
    return false;
  }
  if (isGroup(token)) {
    return false;
  }
  if (isCharClass(token)) {
    return false;
  }
  if (token.startsWith("\\") && token.length === 2) {
    return false;
  }
  return true;
}

function joinExplanations(parts: string[]): string {
  return parts.join(", then ");
}

/**
 * Fluent, chainable regex builder.
 * Each method appends a token and returns the same instance for chaining.
 */
export class Builder<Groups extends string = never> {
  private tokens: string[] = [];
  private descriptions: string[] = [];
  private started = false;
  private ended = false;
  private lastTokenLazy = false;
  private storedFlags?: string;
  private lastTokenQuantified = false;

  private ensureCanAdd(): void {
    if (this.ended) {
      throw new Error("Cannot add tokens after end() anchor");
    }
  }

  private addToken(token: string, description: string): this {
    this.ensureCanAdd();
    this.tokens.push(token);
    this.descriptions.push(description);
    this.lastTokenQuantified = false;
    this.lastTokenLazy = false;
    return this;
  }

  private requireLast(): number {
    if (this.tokens.length === 0) {
      throw new Error("No previous token to apply a quantifier to");
    }
    return this.tokens.length - 1;
  }

  private getToken(index: number): string {
    const token = this.tokens[index];
    if (token === undefined) {
      throw new Error("Missing token at index");
    }
    return token;
  }

  private getDescription(index: number): string {
    const description = this.descriptions[index];
    if (description === undefined) {
      throw new Error("Missing description at index");
    }
    return description;
  }

  private applyQuantifier(
    suffix: string,
    describe: (inner: string) => string
  ): this {
    this.ensureCanAdd();
    const index = this.requireLast();
    const token = this.getToken(index);
    if (this.lastTokenQuantified) {
      throw new Error(
        "Cannot apply quantifier to an already-quantified token. Use an explicit group if nesting is intentional."
      );
    }
    const grouped = needsQuantifierGrouping(token) ? `(?:${token})` : token;
    this.tokens[index] = `${grouped}${suffix}`;
    this.descriptions[index] = describe(this.getDescription(index));
    this.lastTokenQuantified = true;
    this.lastTokenLazy = false;
    return this;
  }

  /** Add a start-of-line anchor (`^`). Must be the first token. */
  start(): this {
    if (this.tokens.length > 0 || this.started) {
      throw new Error("start() must be the first token");
    }
    this.started = true;
    return this.addToken("^", "start of string");
  }

  /** Add an end-of-line anchor (`$`). */
  end(): this {
    const result = this.addToken("$", "end of string");
    this.ended = true;
    return result;
  }

  /** Add a literal string with regex metacharacters escaped. */
  literal(text: string): this {
    const escaped = escapeLiteral(text);
    return this.addToken(escaped, `the literal text "${text}"`);
  }

  /**
   * Add a character class matching any of the given characters.
   * Escapes `\\`, `]`, `-`, and `^` for safety.
   */
  anyOf(chars: string | string[]): this {
    const raw = normalizeChars(chars);
    if (raw.length === 0) {
      throw new Error("anyOf(chars) requires at least one character");
    }
    const escaped = escapeCharClass(raw);
    return this.addToken(`[${escaped}]`, `any of these characters: "${raw}"`);
  }

  /**
   * Add a negated character class matching none of the given characters.
   * Escapes `\\`, `]`, `-`, and `^` for safety.
   */
  noneOf(chars: string | string[]): this {
    const raw = normalizeChars(chars);
    if (raw.length === 0) {
      throw new Error("noneOf(chars) requires at least one character");
    }
    const escaped = escapeCharClass(raw);
    return this.addToken(`[^${escaped}]`, `none of these characters: "${raw}"`);
  }

  /**
   * Add a character range, e.g. `range("a", "z")` -> `[a-z]`.
   * Bounds are escaped for safety.
   */
  range(from: string, to: string): this {
    if ([...from].length !== 1 || [...to].length !== 1) {
      throw new Error(
        "range(from, to) requires each bound to be exactly one code point"
      );
    }
    const escapedFrom = escapeCharClass(from);
    const escapedTo = escapeCharClass(to);
    return this.addToken(
      `[${escapedFrom}-${escapedTo}]`,
      `a character from "${from}" to "${to}"`
    );
  }

  /** Add a dot wildcard (`.`). */
  any(): this {
    return this.addToken(".", "any character");
  }

  /** Add a digit matcher (`\\d`). */
  digit(): this {
    return this.addToken("\\d", "a digit");
  }

  /** Add a word character matcher (`\\w`). */
  word(): this {
    return this.addToken("\\w", "a word character");
  }

  /** Add a word boundary matcher (`\\b`). */
  wordBoundary(): this {
    return this.addToken("\\b", "a word boundary");
  }

  /** Add a non-word-boundary matcher (`\\B`). */
  nonWordBoundary(): this {
    return this.addToken("\\B", "not a word boundary");
  }

  /** Add a letter matcher (`[a-zA-Z]`). */
  letter(): this {
    return this.addToken("[a-zA-Z]", "a letter");
  }

  /** Add a whitespace matcher (`\\s`). */
  whitespace(): this {
    return this.addToken("\\s", "whitespace");
  }

  /** Add a literal space character. */
  space(): this {
    return this.addToken(" ", "a space");
  }

  /** Add a line-break matcher (`\\n`). */
  lineBreak(): this {
    return this.addToken("\\n", "a line break");
  }

  /** Add a tab matcher (`\\t`). */
  tab(): this {
    return this.addToken("\\t", "a tab");
  }

  /** Add a capturing group built by the provided callback. */
  group<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    const child = fn(new Builder());
    this.addToken(
      `(${child.toString()})`,
      `a group containing (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | G>;
  }

  /** Add a named capturing group `(?<name>...)`. */
  namedGroup<Name extends string, G extends string = never>(
    name: Name,
    fn: (b: Builder) => Builder<G>
  ): Builder<Groups | Name | G> {
    assertValidGroupName(name);
    const child = fn(new Builder());
    this.addToken(
      `(?<${name}>${child.toString()})`,
      `a named group "${name}" containing (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | Name | G>;
  }

  /** Add a non-capturing group `(?:...)`. */
  nonCapture<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    const child = fn(new Builder());
    this.addToken(
      `(?:${child.toString()})`,
      `the sequence (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | G>;
  }

  /** Add a positive lookahead `(?=...)`. */
  lookahead<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    const child = fn(new Builder());
    this.addToken(
      `(?=${child.toString()})`,
      `followed by (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | G>;
  }

  /** Add a negative lookahead `(?!...)`. */
  negativeLookahead<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    const child = fn(new Builder());
    this.addToken(
      `(?!${child.toString()})`,
      `not followed by (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | G>;
  }

  /** Add a positive lookbehind `(?<=...)`. */
  lookbehind<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    const child = fn(new Builder());
    this.addToken(
      `(?<=${child.toString()})`,
      `preceded by (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | G>;
  }

  /** Add a negative lookbehind `(?<!...)`. */
  negativeLookbehind<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    const child = fn(new Builder());
    this.addToken(
      `(?<!${child.toString()})`,
      `not preceded by (${joinExplanations(child.descriptions)})`
    );
    return this as unknown as Builder<Groups | G>;
  }

  /**
   * Alternation scoped to the immediately previous token.
   * Only that token is wrapped in the alternation group.
   *
   * @example
   * ```ts
   * regex().literal("a").literal("b").orLiteral("c").toString()
   * // => "a(?:b|c)"   -- only "b" is alternated, not "ab"
   * ```
   */
  // TODO: whole-expression alternation should be considered for a future major version.
  or<G extends string = never>(fn: (b: Builder) => Builder<G>): Builder<Groups | G> {
    this.ensureCanAdd();
    const index = this.requireLast();
    const left = this.getToken(index);
    const leftDescription = this.getDescription(index);
    const right = fn(new Builder());
    this.tokens[index] = `(?:${left}|${right.toString()})`;
    this.descriptions[index] =
      `(${leftDescription} or ${joinExplanations(right.descriptions)})`;
    this.lastTokenQuantified = false;
    return this as unknown as Builder<Groups | G>;
  }

  /** Convenience for `or((b) => b.literal(text))`. */
  orLiteral<G extends string = never>(text: string): Builder<Groups | G> {
    return this.or((builder) => builder.literal(text)) as unknown as Builder<Groups | G>;
  }

  /** Make the previous token optional (`?`). */
  optional(): this {
    return this.applyQuantifier("?", (inner) => `optionally, ${inner}`);
  }

  /** Repeat the previous token zero or more times (`*`). */
  zeroOrMore(): this {
    return this.applyQuantifier("*", (inner) => `zero or more of ${inner}`);
  }

  /** Repeat the previous token one or more times (`+`). */
  oneOrMore(): this {
    return this.applyQuantifier("+", (inner) => `one or more of ${inner}`);
  }

  /** Repeat the previous token with an explicit range (`{min}` or `{min,max}`). */
  repeat(min: number, max?: number): this {
    if (min < 0 || !Number.isInteger(min)) {
      throw new Error(
        "repeat(min, max) requires min to be a non-negative integer"
      );
    }
    if (max !== undefined && (max < min || !Number.isInteger(max))) {
      throw new Error(
        "repeat(min, max) requires max to be a non-negative integer >= min"
      );
    }

    const range = max === undefined ? `{${min}}` : `{${min},${max}}`;
    const describe =
      max === undefined
        ? (inner: string) =>
            `${inner}, repeated ${min} time${min === 1 ? "" : "s"}`
        : (inner: string) =>
            `${inner}, repeated between ${min} and ${max} times`;
    return this.applyQuantifier(range, describe);
  }

  /** Alias for `repeat(count)`. Repeats the previous token exactly `count` times (`{n}`). */
  exactly(count: number): this {
    return this.repeat(count);
  }

  /** Match any of the given alternatives, e.g. `oneOf(cat, dog)` => `(?:cat|dog)`. */
  oneOf<G extends string = never>(...alternatives: Array<(b: Builder) => Builder<G>>): Builder<Groups | G> {
    if (alternatives.length < 2) {
      throw new Error("oneOf() requires at least two alternatives");
    }
    const built = alternatives.map((fn) => fn(new Builder()));
    const pattern = built.map((b) => b.toString()).join("|");
    const description = built
      .map((b) => joinExplanations(b.descriptions))
      .join(", ");
    this.addToken(`(?:${pattern})`, `one of: ${description}`);
    return this as unknown as Builder<Groups | G>;
  }

  /** Convenience for `oneOf` with literal strings. */
  oneOfLiteral<G extends string = never>(...alternatives: string[]): Builder<Groups | G> {
    return this.oneOf(...alternatives.map((s) => (b: Builder) => b.literal(s))) as unknown as Builder<Groups | G>;
  }

  /** Inject a raw regex string without escaping. Use sparingly for edge cases the builder does not cover. */
  raw(str: string): this {
    if (str.length === 0) {
      throw new Error("raw(str) requires a non-empty string");
    }
    return this.addToken(str, `the raw pattern "${str}"`);
  }

  /** Add a Unicode property escape (`\\p{Name}` or `\\p{Name=Value}`). Requires the `u` flag at runtime. */
  unicodeProperty(name: string, value?: string): this {
    if (name.length === 0) {
      throw new Error(
        "unicodeProperty(name) requires a non-empty property name"
      );
    }
    if (value !== undefined) {
      if (value.length === 0) {
        throw new Error(
          "unicodeProperty(name, value) requires a non-empty value"
        );
      }
      this.addToken(
        `\\p{${name}=${value}}`,
        `a character with the Unicode property "${name}=${value}"`
      );
      this.appendFlag("u");
      return this;
    }
    this.addToken(
      `\\p{${name}}`,
      `a character with the Unicode property "${name}"`
    );
    this.appendFlag("u");
    return this;
  }

  /** Add a backreference by group number (`\\n`) or group name (`\\k<name>`). */
  backreference(ref: number | string): this {
    if (typeof ref === "number") {
      if (!Number.isInteger(ref) || ref < 1) {
        throw new Error("backreference(n) requires a positive integer");
      }
      return this.addToken(`\\${ref}`, `a backreference to group ${ref}`);
    }
    if (ref.length === 0) {
      throw new Error("backreference(name) requires a non-empty name");
    }
    return this.addToken(
      `\\k<${ref}>`,
      `a backreference to the named group "${ref}"`
    );
  }

  /** Make the previous quantifier non-greedy (`??`, `*?`, `+?`, `{n}?`, `{n,m}?`). */
  lazy(): this {
    if (this.lastTokenLazy) {
      throw new Error("lazy() can only be applied once");
    }
    const index = this.requireLast();
    const token = this.getToken(index);
    const lastChar = token[token.length - 1];
    if (!lastChar || (!"*+?".includes(lastChar) && lastChar !== "}")) {
      throw new Error(
        "lazy() requires a preceding quantifier (optional, zeroOrMore, oneOrMore, or repeat)"
      );
    }
    this.tokens[index] = `${token}?`;
    this.descriptions[index] = `${this.getDescription(index)} (matched lazily)`;
    this.lastTokenLazy = true;
    return this;
  }

  /** Alias for `repeat(min, max)`. Repeats the previous token between `min` and `max` times (`{min,max}`). */
  between(min: number, max: number): this {
    return this.repeat(min, max);
  }

  /** Store default flags to use when calling `toRegExp()`. */
  flags(flags: string): this {
    if (flags.length === 0) {
      throw new Error("flags() requires at least one flag character");
    }
    for (const ch of flags) {
      if (!VALID_FLAGS.includes(ch)) {
        throw new Error(
          `Invalid flag '${ch}'. Allowed flags are: d, g, i, m, s, u, y`
        );
      }
    }
    if (new Set(flags).size !== flags.length) {
      throw new Error("flags() contains duplicate characters");
    }
    this.storedFlags = flags;
    return this;
  }

  private appendFlag(flag: string): this {
    if (!this.storedFlags) {
      this.storedFlags = flag;
      return this;
    }
    if (!this.storedFlags.includes(flag)) {
      this.storedFlags += flag;
    }
    return this;
  }

  /** Enable global ("g") flag. */
  global(): this {
    return this.appendFlag("g");
  }

  /** Enable ignore-case ("i") flag. */
  ignoreCase(): this {
    return this.appendFlag("i");
  }

  /** Enable multiline ("m") flag. */
  multiline(): this {
    return this.appendFlag("m");
  }

  /** Enable dotAll ("s") flag. */
  dotAll(): this {
    return this.appendFlag("s");
  }

  /** Enable unicode ("u") flag. */
  unicode(): this {
    return this.appendFlag("u");
  }

  /** Enable hasIndices ("d") flag. */
  hasIndices(): this {
    return this.appendFlag("d");
  }

  /** Build the raw regex pattern string. */
  toString(): string {
    return this.tokens.join("");
  }

  /** Clone the current builder for safe branching. */
  clone(): Builder<Groups> {
    const next = new Builder();
    next.tokens = [...this.tokens];
    next.descriptions = [...this.descriptions];
    next.started = this.started;
    next.ended = this.ended;
    next.lastTokenLazy = this.lastTokenLazy;
    next.storedFlags = this.storedFlags;
    next.lastTokenQuantified = this.lastTokenQuantified;
    return next as unknown as Builder<Groups>;
  }

  /** Build a native `RegExp`, using passed flags or stored flags. */
  toRegExp(flags?: string): RegExp {
    const finalFlags = flags ?? this.storedFlags;
    return new RegExp(this.toString(), finalFlags);
  }

  /** Test the built `RegExp` against input. */
  matches(input: string, flags?: string): boolean {
    return this.toRegExp(flags).test(input);
  }

  /** Return a human-readable, plain-English explanation of the current chain. */
  explain(): string {
    if (this.descriptions.length === 0) {
      return "An empty pattern.";
    }
    const joined = joinExplanations(this.descriptions);
    return `${joined.charAt(0).toUpperCase()}${joined.slice(1)}.`;
  }

  /**
   * Execute the regex against input and return typed match data.
   * Note: named groups inside optional or alternation constructs may be undefined at runtime.
   */
  exec(input: string, flags?: string): TypedExec<Groups> | null {
    const re = this.toRegExp(flags);
    return re.exec(input) as unknown as TypedExec<Groups> | null;
  }

  /**
   * Match the regex against input and return typed match data.
   * Note: named groups inside optional or alternation constructs may be undefined at runtime.
   */
  match(input: string, flags?: string): TypedMatch<Groups> | null {
    const re = this.toRegExp(flags);
    return input.match(re) as unknown as TypedMatch<Groups> | null;
  }

  /**
   * Iterate over all matches in the input. Ensures the global flag is present.
   * Note: named groups inside optional or alternation constructs may be undefined at runtime.
   */
  matchAll(input: string, flags?: string): TypedMatch<Groups>[] {
    const resolvedFlags = flags ?? this.storedFlags;
    const finalFlags = resolvedFlags && !resolvedFlags.includes("g") ? resolvedFlags + "g" : resolvedFlags || "g";
    const re = new RegExp(this.toString(), finalFlags);
    return Array.from(input.matchAll(re)) as unknown as TypedMatch<Groups>[];
  }

  /** Replace the first match (or all matches, with the global flag) in the input string. */
  replace(input: string, replacement: ReplaceValue, flags?: string): string {
    const re = this.toRegExp(flags);
    return typeof replacement === "string"
      ? input.replace(re, replacement)
      : input.replace(re, replacement);
  }

  /** Replace all matches in the input string (ensures the global flag). */
  replaceAll(input: string, replacement: ReplaceValue, flags?: string): string {
    const resolvedFlags = flags ?? this.storedFlags;
    const finalFlags =
      resolvedFlags && !resolvedFlags.includes("g")
        ? resolvedFlags + "g"
        : resolvedFlags || "g";
    const re = new RegExp(this.toString(), finalFlags);
    return typeof replacement === "string"
      ? input.replace(re, replacement)
      : input.replace(re, replacement);
  }

  /** Split the input string by matches. */
  split(input: string, flags?: string): string[] {
    const re = this.toRegExp(flags);
    return input.split(re);
  }
}

/** Create a new regex builder. */
export function regex(): Builder<never> {
  return new Builder();
}
