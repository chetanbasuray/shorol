import { describe, expect, it } from "vitest";
import { regex } from "./index";

describe("unicode flag propagation", () => {
  it("unicodeProperty sets u flag and matches correctly", () => {
    const b = regex().group((g) => g.unicodeProperty("L"));
    expect(b.toRegExp().flags).toBe("u");
    expect(b.matches("é")).toBe(true);
    expect(b.matches("1")).toBe(false);
  });

  const prop = (g: ReturnType<typeof regex>) => g.unicodeProperty("L");
  it.each([
    ["namedGroup", () => regex().namedGroup("x", prop)],
    ["nonCapture", () => regex().nonCapture(prop)],
    ["lookahead", () => regex().lookahead(prop)],
    ["negativeLookahead", () => regex().negativeLookahead(prop)],
    ["lookbehind", () => regex().lookbehind(prop)],
    ["negativeLookbehind", () => regex().negativeLookbehind(prop)],
    ["or", () => regex().literal("a").or(prop)],
    ["oneOf", () => regex().oneOf(prop, (g) => g.literal("x"))],
  ] as const)(
    "%s propagates the u flag from its child builder",
    (_name, build) => {
      expect(build().toRegExp().flags).toContain("u");
    }
  );

  it("nested unicodeProperty propagates u flag", () => {
    const b = regex().group((g) => g.nonCapture((h) => h.unicodeProperty("L")));
    expect(b.toRegExp().flags).toBe("u");
  });

  it("stored flags combine with u flag", () => {
    const b = regex().unicodeProperty("L").flags("g");
    expect(b.toRegExp().flags).toBe("gu");
    expect(b.matches("x")).toBe(true);
  });

  it("explicit flags argument combines with u flag", () => {
    const b = regex().unicodeProperty("L");
    expect(b.toRegExp("i").flags).toBe("iu");
    const matches = b.matchAll("ab1", "i");
    expect(matches.length).toBe(2);
    expect(b.replaceAll("ab1", "_", "i")).toBe("__1");
  });

  it("v flag is not combined with u", () => {
    const b = regex().unicodeProperty("L");
    expect(b.toRegExp("v").flags).toBe("v");
  });

  it("anyOf with astral char sets u flag and matches correctly", () => {
    const b = regex().start().anyOf("😀").end();
    expect(b.matches("😀")).toBe(true);
    expect(b.matches("\uD83D")).toBe(false);
    expect(b.toRegExp().flags).toBe("u");
  });

  it("noneOf with astral char sets u flag", () => {
    const b = regex().start().noneOf("😀").end();
    expect(b.matches("a")).toBe(true);
    expect(b.toRegExp().flags).toContain("u");
  });

  it("range with astral chars matches correctly", () => {
    const b = regex().start().range("😀", "😃").end();
    expect(b.matches("😁")).toBe(true);
  });

  it("range throws when from is after to", () => {
    expect(() => regex().range("z", "a")).toThrow(
      "range(from, to) requires from to be at or before to"
    );
  });

  it("ASCII patterns stay flag-free", () => {
    expect(regex().anyOf("ab").toRegExp().flags).toBe("");
    expect(regex().range("a", "z").toRegExp().flags).toBe("");
    expect(regex().digit().flags("g").toRegExp().flags).toBe("g");
  });

  it("clone copies requiresUnicode bit", () => {
    const b = regex().unicodeProperty("L").clone().flags("g");
    expect(b.toRegExp().flags).toBe("gu");
  });
});
