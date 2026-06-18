import { describe, expect, it } from "vitest";
import { escapeLiteral, regex } from "./index";

describe("shorol regex builder", () => {
  it("escapes literals", () => {
    const pattern = regex().literal("a+b*").toString();
    expect(pattern).toBe("a\\+b\\*");
  });

  it("exports escapeLiteral helper", () => {
    expect(escapeLiteral("a+b*")).toBe("a\\+b\\*");
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

  it("supports letter() token", () => {
    const pattern = regex().letter().toString();
    expect(pattern).toBe("[a-zA-Z]");
  });

  it("supports space() token", () => {
    const pattern = regex().space().toString();
    expect(pattern).toBe(" ");
  });

  it("supports boundary helpers", () => {
    const pattern = regex().wordBoundary().literal("cat").nonWordBoundary().toString();
    expect(pattern).toBe("\\bcat\\B");
  });

  it("supports lineBreak() and tab() helpers", () => {
    const pattern = regex().literal("a").lineBreak().tab().literal("b").toString();
    expect(pattern).toBe("a\\n\\tb");
  });

  it("supports matches() helper", () => {
    const builder = regex().start().literal("cat").end();
    expect(builder.matches("cat")).toBe(true);
    expect(builder.matches("cats")).toBe(false);
  });

  it("supports clone() for safe branching", () => {
    const base = regex().start().literal("id");
    const left = base.clone().literal("-").digit().repeat(2).end().toString();
    const right = base.clone().literal("_").word().oneOrMore().end().toString();

    expect(left).toBe("^id-\\d{2}$");
    expect(right).toBe("^id_\\w+$");
    expect(base.toString()).toBe("^id");
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
    expect(escapedRange).toBe("[\\--\\]]");
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
    const re2 = regex().literal("hi").flags("d").toRegExp();
    expect(re2.flags).toBe("d");
  });

  it("supports convenience flag helpers", () => {
    const re = regex().literal("hi").global().ignoreCase().toRegExp();
    expect(re.flags).toBe("gi");
  });

  it("avoids duplicate flags and preserves order", () => {
    const re = regex().literal("hi").global().global().ignoreCase().toRegExp();
    expect(re.flags).toBe("gi");
  });

  it("rejects invalid flags in flags()", () => {
    expect(() => regex().flags("z")).toThrow("Invalid flag 'z'");
    expect(() => regex().flags("igz")).toThrow("Invalid flag 'z'");
    expect(() => regex().flags("1")).toThrow("Invalid flag '1'");
    expect(() => regex().flags("dz")).toThrow("Invalid flag 'z'");
  });

  it("rejects duplicate flags in flags()", () => {
    expect(() => regex().flags("gg")).toThrow("contains duplicate characters");
    expect(() => regex().flags("igi")).toThrow("contains duplicate characters");
  });

  it("rejects empty flags string", () => {
    expect(() => regex().flags("")).toThrow("requires at least one flag character");
  });

  it("appends helper flags to stored flags", () => {
    const re = regex().literal("hi").flags("im").global().toRegExp();
    expect(re.flags).toBe("gim");
  });

  it("supports multiline, dotAll, unicode, and hasIndices helpers", () => {
    const re = regex().literal("hi").multiline().dotAll().unicode().toRegExp();
    expect(re.flags).toBe("msu");
    const re2 = regex().literal("hi").hasIndices().toRegExp();
    expect(re2.flags).toBe("d");
  });

  it("builds RegExp with flags", () => {
    const re = regex().literal("hi").toRegExp("i");
    expect(re).toBeInstanceOf(RegExp);
    expect(re.flags).toBe("i");
    expect(re.source).toBe("hi");
    const re2 = regex().literal("hi").toRegExp("d");
    expect(re2.flags).toBe("d");
  });

  it("enforces anchors and token sequencing rules", () => {
    expect(() => regex().literal("a").start()).toThrow();
    expect(() => regex().start().start()).toThrow();
    expect(() => regex().end().literal("a")).toThrow();
  });

  it("blocks pattern mutations after end()", () => {
    expect(() => regex().literal("a").end().optional()).toThrow("Cannot add tokens");
    expect(() => regex().literal("a").end().orLiteral("b")).toThrow("Cannot add tokens");
    expect(regex().literal("a").end().global().toRegExp().flags).toBe("g");
    expect(regex().literal("a").end().flags("i").toRegExp().flags).toBe("i");
  });

  it("rejects nested quantifiers", () => {
    expect(() => regex().literal("a").oneOrMore().oneOrMore()).toThrow("already-quantified");
    expect(() => regex().literal("a").optional().zeroOrMore()).toThrow("already-quantified");
    expect(() => regex().literal("a").repeat(2).oneOrMore()).toThrow("already-quantified");
  });

  it("allows literals ending in escaped metacharacters under quantifiers", () => {
    expect(() => regex().literal("https?").oneOrMore()).not.toThrow();
    expect(regex().literal("https?").oneOrMore().toString()).toBe("(?:https\\?)+");
    expect(() => regex().literal("c++").oneOrMore()).not.toThrow();
    expect(regex().literal("c++").oneOrMore().toString()).toBe("(?:c\\+\\+)+");
  });

  it("carries quantified state across clone", () => {
    const base = regex().literal("a").oneOrMore();
    const cloned = base.clone();
    expect(() => cloned.oneOrMore()).toThrow("already-quantified");
  });

  it("accepts single code point in range()", () => {
    const emoji = regex().range("😀", "😎").toString();
    expect(emoji).toBe("[😀-😎]");
  });

  it("documents single-token-scope alternation", () => {
    const pattern = regex().literal("a").literal("b").orLiteral("c").toString();
    expect(pattern).toBe("a(?:b|c)");
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
    const charClass = regex().anyOf("abc").oneOrMore().toString();
    expect(charClass).toBe("[abc]+");
    const negClass = regex().noneOf("abc").oneOrMore().toString();
    expect(negClass).toBe("[^abc]+");
  });

  it("validates repeat ranges", () => {
    expect(() => regex().literal("a").repeat(-1)).toThrow();
    expect(() => regex().literal("a").repeat(2, 1)).toThrow();
    expect(() => regex().literal("a").repeat(1, Number.NaN)).toThrow();
    expect(() => regex().literal("a").repeat(2.5)).toThrow();
    expect(() => regex().literal("a").repeat(1, 2.5)).toThrow();
  });

  it("supports exactly() alias", () => {
    const pattern = regex().literal("a").exactly(3).toString();
    expect(pattern).toBe("a{3}");
    expect(() => regex().literal("a").exactly(-1)).toThrow();
    expect(() => regex().literal("a").exactly(1.5)).toThrow();
  });

  it("supports between() alias", () => {
    const pattern = regex().literal("a").between(2, 5).toString();
    expect(pattern).toBe("a{2,5}");
    expect(() => regex().literal("a").between(2, 1)).toThrow();
  });

  it("validates character class inputs", () => {
    expect(() => regex().anyOf([])).toThrow();
    expect(() => regex().noneOf("")).toThrow();
    expect(() => regex().range("", "a")).toThrow();
    expect(() => regex().range("ab", "yz")).toThrow("one code point");
  });

  it("throws when or() is called without a previous token", () => {
    expect(() => regex().or((b) => b.literal("x"))).toThrow();
  });

  it("covers repeat success paths", () => {
    const exact = regex().literal("a").repeat(2).toString();
    expect(exact).toBe("a{2}");
    const ranged = regex().literal("a").repeat(2, 3).toString();
    expect(ranged).toBe("a{2,3}");
  });

  it("guards internal token access", () => {
    const builder = regex() as unknown as { getToken: (index: number) => string };
    expect(() => builder.getToken(0)).toThrow("Missing token at index");
  });

  it("lazy() makes the previous quantifier non-greedy", () => {
    expect(regex().literal("a").optional().lazy().toString()).toBe("a??");
    expect(regex().literal("a").zeroOrMore().lazy().toString()).toBe("a*?");
    expect(regex().literal("a").oneOrMore().lazy().toString()).toBe("a+?");
    expect(regex().literal("a").repeat(3).lazy().toString()).toBe("a{3}?");
    expect(regex().literal("a").repeat(2, 5).lazy().toString()).toBe("a{2,5}?");
  });

  it("lazy() groups multi-char tokens", () => {
    expect(regex().literal("ab").oneOrMore().lazy().toString()).toBe("(?:ab)+?");
  });

  it("lazy() throws without a quantifier", () => {
    expect(() => regex().literal("a").lazy()).toThrow("lazy() requires a preceding quantifier");
    expect(() => regex().start().lazy()).toThrow();
    expect(() => regex().lazy()).toThrow();
  });

  it("lazy() throws when applied twice", () => {
    expect(() => regex().literal("a").oneOrMore().lazy().lazy()).toThrow("lazy() can only be applied once");
  });

  it("backreference() by number adds \\n", () => {
    expect(regex().backreference(1).toString()).toBe("\\1");
    expect(regex().backreference(12).toString()).toBe("\\12");
    expect(() => regex().backreference(0)).toThrow("positive integer");
    expect(() => regex().backreference(-1)).toThrow("positive integer");
    expect(() => regex().backreference(1.5)).toThrow("positive integer");
  });

  it("backreference() by name adds \\k<name>", () => {
    expect(regex().backreference("name").toString()).toBe("\\k<name>");
    expect(regex().backreference("group_1").toString()).toBe("\\k<group_1>");
    expect(() => regex().backreference("")).toThrow("non-empty name");
  });

  it("unicodeProperty() adds \\p{Name}", () => {
    expect(regex().unicodeProperty("Letter").toString()).toBe("\\p{Letter}");
    expect(regex().unicodeProperty("Script", "Greek").toString()).toBe("\\p{Script=Greek}");
    expect(() => regex().unicodeProperty("")).toThrow("non-empty property name");
    expect(() => regex().unicodeProperty("Letter", "")).toThrow("non-empty value");
  });

  it("raw() injects without escaping", () => {
    expect(regex().raw("\\d{3}").toString()).toBe("\\d{3}");
    expect(regex().raw("(?=look)").toString()).toBe("(?=look)");
    expect(() => regex().raw("")).toThrow("non-empty string");
  });

  it("raw() after end() still throws", () => {
    expect(() => regex().end().raw("x")).toThrow();
  });

  it("oneOf() matches any alternative", () => {
    expect(
      regex().oneOf(
        (b) => b.literal("cat"),
        (b) => b.literal("dog"),
        (b) => b.literal("bird")
      ).toString()
    ).toBe("(?:cat|dog|bird)");
  });

  it("oneOfLiteral() convenience with strings", () => {
    expect(regex().oneOfLiteral("yes", "no", "maybe").toString()).toBe("(?:yes|no|maybe)");
    expect(() => regex().oneOfLiteral("only")).toThrow("requires at least two alternatives");
  });

  it("oneOf() throws with less than 2 alternatives", () => {
    expect(() => regex().oneOf((b) => b.literal("x"))).toThrow("requires at least two alternatives");
  });
});
