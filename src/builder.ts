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
      "namedGroup(name, fn) requires a valid group name (letters, digits, underscore, not starting with a digit)"
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

  start(): this {
    if (this.tokens.length > 0 || this.started) {
      throw new Error("start() must be the first token");
    }
    this.started = true;
    return this.addToken("^");
  }

  end(): this {
    const result = this.addToken("$");
    this.ended = true;
    return result;
  }

  literal(text: string): this {
    const escaped = escapeLiteral(text);
    return this.addToken(escaped);
  }

  anyOf(chars: string | string[]): this {
    const raw = normalizeChars(chars);
    if (raw.length === 0) {
      throw new Error("anyOf(chars) requires at least one character");
    }
    const escaped = escapeCharClass(raw);
    return this.addToken(`[${escaped}]`);
  }

  noneOf(chars: string | string[]): this {
    const raw = normalizeChars(chars);
    if (raw.length === 0) {
      throw new Error("noneOf(chars) requires at least one character");
    }
    const escaped = escapeCharClass(raw);
    return this.addToken(`[^${escaped}]`);
  }

  range(from: string, to: string): this {
    if (from.length === 0 || to.length === 0) {
      throw new Error("range(from, to) requires non-empty bounds");
    }
    const escapedFrom = escapeCharClass(from);
    const escapedTo = escapeCharClass(to);
    return this.addToken(`[${escapedFrom}-${escapedTo}]`);
  }

  any(): this {
    return this.addToken(".");
  }

  digit(): this {
    return this.addToken("\\d");
  }

  word(): this {
    return this.addToken("\\w");
  }

  whitespace(): this {
    return this.addToken("\\s");
  }

  group(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(${child.toString()})`);
  }

  namedGroup(name: string, fn: BuildFn): this {
    assertValidGroupName(name);
    const child = fn(new Builder());
    return this.addToken(`(?<${name}>${child.toString()})`);
  }

  nonCapture(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?:${child.toString()})`);
  }

  lookahead(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?=${child.toString()})`);
  }

  negativeLookahead(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?!${child.toString()})`);
  }

  lookbehind(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?<=${child.toString()})`);
  }

  negativeLookbehind(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?<!${child.toString()})`);
  }

  or(fn: BuildFn): this {
    const index = this.requireLast();
    const left = this.getToken(index);
    const right = fn(new Builder()).toString();
    this.tokens[index] = `(?:${left}|${right})`;
    return this;
  }

  orLiteral(text: string): this {
    return this.or((builder) => builder.literal(text));
  }

  optional(): this {
    return this.applyQuantifier("?");
  }

  zeroOrMore(): this {
    return this.applyQuantifier("*");
  }

  oneOrMore(): this {
    return this.applyQuantifier("+");
  }

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

  flags(flags: string): this {
    this.storedFlags = flags;
    return this;
  }

  toString(): string {
    return this.tokens.join("");
  }

  toRegExp(flags?: string): RegExp {
    const finalFlags = flags ?? this.storedFlags;
    return new RegExp(this.toString(), finalFlags);
  }
}

export function regex(): Builder {
  return new Builder();
}
