/** Callback used to build nested groups and lookarounds. */
type BuildFn = (builder: Builder) => Builder;

const META_CHARS = /[.*+?^${}()|[\]\\]/g;
const VALID_FLAGS = "dgimsuy";

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

function needsQuantifierGrouping(token: string): boolean {
  if (token.length <= 1) {
    return false;
  }
  if (isGroup(token)) {
    return false;
  }
  if (token.startsWith("\\") && token.length === 2) {
    return false;
  }
  return true;
}

/**
 * Fluent, chainable regex builder.
 * Each method appends a token and returns the same instance for chaining.
 */
export class Builder {
  private tokens: string[] = [];
  private started = false;
  private ended = false;
  private lastTokenLazy = false;
  private storedFlags?: string;

  private ensureCanAdd(): void {
    if (this.ended) {
      throw new Error("Cannot add tokens after end() anchor");
    }
  }

  private addToken(token: string): this {
    this.ensureCanAdd();
    this.tokens.push(token);
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

  private applyQuantifier(suffix: string): this {
    const index = this.requireLast();
    const token = this.getToken(index);
    const grouped = needsQuantifierGrouping(token) ? `(?:${token})` : token;
    this.tokens[index] = `${grouped}${suffix}`;
    this.lastTokenLazy = false;
    return this;
  }

  /** Add a start-of-line anchor (`^`). Must be the first token. */
  start(): this {
    if (this.tokens.length > 0 || this.started) {
      throw new Error("start() must be the first token");
    }
    this.started = true;
    return this.addToken("^");
  }

  /** Add an end-of-line anchor (`$`). */
  end(): this {
    const result = this.addToken("$");
    this.ended = true;
    return result;
  }

  /** Add a literal string with regex metacharacters escaped. */
  literal(text: string): this {
    const escaped = escapeLiteral(text);
    return this.addToken(escaped);
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
    return this.addToken(`[${escaped}]`);
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
    return this.addToken(`[^${escaped}]`);
  }

  /**
   * Add a character range, e.g. `range("a", "z")` -> `[a-z]`.
   * Bounds are escaped for safety.
   */
  range(from: string, to: string): this {
    if (from.length === 0 || to.length === 0) {
      throw new Error("range(from, to) requires non-empty bounds");
    }
    const escapedFrom = escapeCharClass(from);
    const escapedTo = escapeCharClass(to);
    return this.addToken(`[${escapedFrom}-${escapedTo}]`);
  }

  /** Add a dot wildcard (`.`). */
  any(): this {
    return this.addToken(".");
  }

  /** Add a digit matcher (`\\d`). */
  digit(): this {
    return this.addToken("\\d");
  }

  /** Add a word character matcher (`\\w`). */
  word(): this {
    return this.addToken("\\w");
  }

  /** Add a word boundary matcher (`\\b`). */
  wordBoundary(): this {
    return this.addToken("\\b");
  }

  /** Add a non-word-boundary matcher (`\\B`). */
  nonWordBoundary(): this {
    return this.addToken("\\B");
  }

  /** Add a letter matcher (`[a-zA-Z]`). */
  letter(): this {
    return this.addToken("[a-zA-Z]");
  }

  /** Add a whitespace matcher (`\\s`). */
  whitespace(): this {
    return this.addToken("\\s");
  }

  /** Add a literal space character. */
  space(): this {
    return this.addToken(" ");
  }

  /** Add a line-break matcher (`\\n`). */
  lineBreak(): this {
    return this.addToken("\\n");
  }

  /** Add a tab matcher (`\\t`). */
  tab(): this {
    return this.addToken("\\t");
  }

  /** Add a capturing group built by the provided callback. */
  group(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(${child.toString()})`);
  }

  /** Add a named capturing group `(?<name>...)`. */
  namedGroup(name: string, fn: BuildFn): this {
    assertValidGroupName(name);
    const child = fn(new Builder());
    return this.addToken(`(?<${name}>${child.toString()})`);
  }

  /** Add a non-capturing group `(?:...)`. */
  nonCapture(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?:${child.toString()})`);
  }

  /** Add a positive lookahead `(?=...)`. */
  lookahead(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?=${child.toString()})`);
  }

  /** Add a negative lookahead `(?!...)`. */
  negativeLookahead(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?!${child.toString()})`);
  }

  /** Add a positive lookbehind `(?<=...)`. */
  lookbehind(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?<=${child.toString()})`);
  }

  /** Add a negative lookbehind `(?<!...)`. */
  negativeLookbehind(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?<!${child.toString()})`);
  }

  /** Add alternation with the previous token, e.g. `(?:left|right)`. */
  or(fn: BuildFn): this {
    const index = this.requireLast();
    const left = this.getToken(index);
    const right = fn(new Builder()).toString();
    this.tokens[index] = `(?:${left}|${right})`;
    return this;
  }

  /** Convenience for `or((b) => b.literal(text))`. */
  orLiteral(text: string): this {
    return this.or((builder) => builder.literal(text));
  }

  /** Make the previous token optional (`?`). */
  optional(): this {
    return this.applyQuantifier("?");
  }

  /** Repeat the previous token zero or more times (`*`). */
  zeroOrMore(): this {
    return this.applyQuantifier("*");
  }

  /** Repeat the previous token one or more times (`+`). */
  oneOrMore(): this {
    return this.applyQuantifier("+");
  }

  /** Repeat the previous token with an explicit range (`{min}` or `{min,max}`). */
  repeat(min: number, max?: number): this {
    if (min < 0 || !Number.isFinite(min)) {
      throw new Error("repeat(min, max) requires min >= 0");
    }
    if (max !== undefined && (max < min || !Number.isFinite(max))) {
      throw new Error("repeat(min, max) requires max >= min");
    }

    const range = max === undefined ? `{${min}}` : `{${min},${max}}`;
    return this.applyQuantifier(range);
  }

  /** Alias for `repeat(count)`. Repeats the previous token exactly `count` times (`{n}`). */
  exactly(count: number): this {
    return this.repeat(count);
  }

  /** Match any of the given alternatives, e.g. `oneOf(cat, dog)` → `(?:cat|dog)`. */
  oneOf(...alternatives: BuildFn[]): this {
    if (alternatives.length < 2) {
      throw new Error("oneOf() requires at least two alternatives");
    }
    const parts = alternatives.map((fn) => fn(new Builder()).toString());
    return this.addToken(`(?:${parts.join("|")})`);
  }

  /** Convenience for `oneOf` with literal strings. */
  oneOfLiteral(...alternatives: string[]): this {
    return this.oneOf(...alternatives.map((s) => (b: Builder) => b.literal(s)));
  }

  /** Inject a raw regex string without escaping. Use sparingly for edge cases the builder does not cover. */
  raw(str: string): this {
    if (str.length === 0) {
      throw new Error("raw(str) requires a non-empty string");
    }
    return this.addToken(str);
  }

  /** Add a Unicode property escape (`\\p{Name}` or `\\p{Name=Value}`). Requires the `u` flag at runtime. */
  unicodeProperty(name: string, value?: string): this {
    if (name.length === 0) {
      throw new Error("unicodeProperty(name) requires a non-empty property name");
    }
    if (value !== undefined) {
      if (value.length === 0) {
        throw new Error("unicodeProperty(name, value) requires a non-empty value");
      }
      return this.addToken(`\\p{${name}=${value}}`);
    }
    return this.addToken(`\\p{${name}}`);
  }

  /** Add a backreference by group number (`\\n`) or group name (`\\k<name>`). */
  backreference(ref: number | string): this {
    if (typeof ref === "number") {
      if (!Number.isInteger(ref) || ref < 1) {
        throw new Error("backreference(n) requires a positive integer");
      }
      return this.addToken(`\\${ref}`);
    }
    if (ref.length === 0) {
      throw new Error("backreference(name) requires a non-empty name");
    }
    return this.addToken(`\\k<${ref}>`);
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
  clone(): Builder {
    const next = new Builder();
    next.tokens = [...this.tokens];
    next.started = this.started;
    next.ended = this.ended;
    next.lastTokenLazy = this.lastTokenLazy;
    next.storedFlags = this.storedFlags;
    return next;
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
}

/** Create a new regex builder. */
export function regex(): Builder {
  return new Builder();
}
