type BuildFn = (builder: Builder) => Builder;

const META_CHARS = /[.*+?^${}()|[\]\\]/g;

function escapeLiteral(input: string): string {
  return input.replace(META_CHARS, "\\$&");
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

  nonCapture(fn: BuildFn): this {
    const child = fn(new Builder());
    return this.addToken(`(?:${child.toString()})`);
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

  toString(): string {
    return this.tokens.join("");
  }

  toRegExp(flags?: string): RegExp {
    return new RegExp(this.toString(), flags);
  }
}

export function regex(): Builder {
  return new Builder();
}
