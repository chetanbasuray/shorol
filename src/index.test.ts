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

  it("supports alternation on the previous token", () => {
    const pattern = regex().literal("yes").orLiteral("no").toString();
    expect(pattern).toBe("(?:yes|no)");
  });

  it("builds RegExp with flags", () => {
    const re = regex().literal("hi").toRegExp("i");
    expect(re).toBeInstanceOf(RegExp);
    expect(re.flags).toBe("i");
    expect(re.source).toBe("hi");
  });
});
