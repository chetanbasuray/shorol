/** Callback used to build nested groups and lookarounds. */
type BuildFn = (builder: Builder) => Builder;

const META_CHARS = /[.*+?^${}()|[\]\\]/g;

function escapeLiteral(input: string): string {
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
  private storedFlags?: string;

  private ensureCanAdd(): void {
    if (this.ended) {
      throw new Error("Cannot add tokens after end() anchor");
    }
  }

  private addToken(token: string): this {
    this.ensureCanAdd();
    this.tokens.push(token);
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

  /** Add a letter matcher (`[a-zA-Z]`). */
  letter(): this {
    return this.addToken("[a-zA-Z]");
  }

  /** Add a whitespace matcher (`\\s`). */
  whitespace(): this {
    return this.addToken("\\s");
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

  /** Store default flags to use when calling `toRegExp()`. */
  flags(flags: string): this {
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

  /** Build the raw regex pattern string. */
  toString(): string {
    return this.tokens.join("");
  }

  /** Build a native `RegExp`, using passed flags or stored flags. */
  toRegExp(flags?: string): RegExp {
    const finalFlags = flags ?? this.storedFlags;
    return new RegExp(this.toString(), finalFlags);
  }
}

/** Create a new regex builder. */
export function regex(): Builder {
  return new Builder();
}
