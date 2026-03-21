import { describe, expect, it } from "vitest";
import { regex } from "./index";

describe("shorol regex builder", () => {
  it("escapes literals", () => {
    const pattern = regex().literal("a+b*").toString();
    expect(pattern).toBe("a\\+b\\*");
  });

  it("supports anchors", () => {
    const pattern = regex().start().literal("cat").end().toString();
    expect(pattern).toBe("^cat$");
  });

  it("applies quantifiers to the previous token", () => {
    const pattern = regex().literal("ab").oneOrMore().toString();
    expect(pattern).toBe("(?:ab)+");
  });

  it("supports groups and non-capture groups", () => {
    const pattern = regex()
      .group((b) => b.literal("cat").orLiteral("dog"))
      .whitespace()
      .word()
      .oneOrMore()
      .toString();

    expect(pattern).toBe("((?:cat|dog))\\s\\w+");
  });

  it("supports non-capture groups directly", () => {
    const pattern = regex().nonCapture((b) => b.literal("hi")).toString();
    expect(pattern).toBe("(?:hi)");
  });

  it("supports any() token", () => {
    const pattern = regex().any().toString();
    expect(pattern).toBe(".");
  });

  it("supports alternation on the previous token", () => {
    const pattern = regex().literal("yes").orLiteral("no").toString();
    expect(pattern).toBe("(?:yes|no)");
  });

  it("supports character class helpers with escaping", () => {
    const pattern = regex().anyOf(["a", "-", "]", "^"]).toString();
    expect(pattern).toBe("[a\\-\\]\\^]");
    const none = regex().noneOf("a-]").toString();
    expect(none).toBe("[^a\\-\\]]");
    const range = regex().range("a", "z").toString();
    expect(range).toBe("[a-z]");
    const escapedRange = regex().range("-", "]").toString();
    expect(escapedRange).toBe("[\\-\\]]");
  });

  it("supports named capture groups", () => {
    const pattern = regex()
      .namedGroup("animal", (b) => b.literal("cat").orLiteral("dog"))
      .toString();
    expect(pattern).toBe("(?<animal>(?:cat|dog))");
  });

  it("rejects invalid named capture group names", () => {
    expect(() => regex().namedGroup("1bad", (b) => b.literal("x"))).toThrow();
  });

  it("supports lookarounds", () => {
    const pattern = regex()
      .lookahead((b) => b.literal("cat"))
      .literal("dog")
      .negativeLookbehind((b) => b.literal("bad"))
      .toString();
    expect(pattern).toBe("(?=cat)dog(?<!bad)");
  });

  it("supports lookbehind and negative lookahead", () => {
    const pattern = regex()
      .lookbehind((b) => b.literal("pre"))
      .literal("core")
      .negativeLookahead((b) => b.literal("post"))
      .toString();
    expect(pattern).toBe("(?<=pre)core(?!post)");
  });

  it("stores default flags and allows overrides", () => {
    const re = regex().literal("hi").flags("i").toRegExp();
    expect(re.flags).toBe("i");
    const override = regex().literal("hi").flags("i").toRegExp("g");
    expect(override.flags).toBe("g");
  });

  it("builds RegExp with flags", () => {
    const re = regex().literal("hi").toRegExp("i");
    expect(re).toBeInstanceOf(RegExp);
    expect(re.flags).toBe("i");
    expect(re.source).toBe("hi");
  });

  it("enforces anchors and token sequencing rules", () => {
    expect(() => regex().literal("a").start()).toThrow();
    expect(() => regex().start().start()).toThrow();
    expect(() => regex().end().literal("a")).toThrow();
  });

  it("throws when applying quantifiers without a previous token", () => {
    expect(() => regex().optional()).toThrow();
    expect(() => regex().zeroOrMore()).toThrow();
    expect(() => regex().oneOrMore()).toThrow();
  });

  it("handles quantifier grouping rules", () => {
    const noGroup = regex().literal("a").oneOrMore().toString();
    expect(noGroup).toBe("a+");
    const group = regex().group((b) => b.literal("ab")).oneOrMore().toString();
    expect(group).toBe("(ab)+");
    const digit = regex().digit().oneOrMore().toString();
    expect(digit).toBe("\\d+");
  });

  it("validates repeat ranges", () => {
    expect(() => regex().literal("a").repeat(-1)).toThrow();
    expect(() => regex().literal("a").repeat(2, 1)).toThrow();
    expect(() => regex().literal("a").repeat(1, Number.NaN)).toThrow();
  });

  it("validates character class inputs", () => {
    expect(() => regex().anyOf([])).toThrow();
    expect(() => regex().noneOf("")).toThrow();
    expect(() => regex().range("", "a")).toThrow();
  });

  it("throws when or() is called without a previous token", () => {
    expect(() => regex().or((b) => b.literal("x"))).toThrow();
  });
});
