import { describe, expect, it } from "vitest";
import { type Builder, regex } from "./index";

describe("typed consumption helpers", () => {
  const dateBuilder = () =>
    regex()
      .namedGroup("year", (b) => b.digit().repeat(4))
      .literal("-")
      .namedGroup("month", (b) => b.digit().repeat(2));

  it("match() returns typed named groups", () => {
    const m = dateBuilder().match("2026-10");
    expect(m).not.toBeNull();
    if (m) {
      // Compile-time: groups are typed as { year: string; month: string }.
      const year: string = m.groups.year;
      const month: string = m.groups.month;
      expect(year).toBe("2026");
      expect(month).toBe("10");
    }
  });

  it("match() returns null when there is no match", () => {
    expect(dateBuilder().match("nope")).toBeNull();
  });

  it("exec() returns typed exec data or null", () => {
    const e = dateBuilder().exec("2026-10");
    expect(e?.groups.year).toBe("2026");
    expect(dateBuilder().exec("nope")).toBeNull();
  });

  it("matchAll() adds the global flag when missing", () => {
    const years = regex().namedGroup("y", (b) => b.digit().repeat(4));
    const all = years.matchAll("2024 then 2026");
    expect(all.map((m) => m.groups.y)).toEqual(["2024", "2026"]);
  });

  it("matchAll() keeps an explicitly-global regex", () => {
    const all = regex().digit().matchAll("a1b2", "g");
    expect(all.map((m) => m[0])).toEqual(["1", "2"]);
  });

  it("matchAll() honours stored non-global flags and still adds g", () => {
    const all = regex().literal("x").flags("i").matchAll("XxX");
    expect(all.length).toBe(3);
  });

  it("replace() supports string and function replacements", () => {
    const b = regex().digit().oneOrMore();
    expect(b.replace("a123b", "#")).toBe("a#b");
    expect(b.replace("a123b", (m) => `<${m}>`)).toBe("a<123>b");
  });

  it("replaceAll() replaces every match, adding g as needed", () => {
    const b = regex().digit();
    expect(b.replaceAll("a1b2c3", "#")).toBe("a#b#c#");
    expect(b.replaceAll("a1b2", (m) => `(${m})`)).toBe("a(1)b(2)");
    // explicit global flag path
    expect(b.replaceAll("1-2", "x", "g")).toBe("x-x");
    // stored non-global flag path
    expect(regex().letter().flags("i").replaceAll("aXb", "_")).toBe("___");
  });

  it("split() splits on the pattern", () => {
    expect(regex().literal(",").split("a,b,c")).toEqual(["a", "b", "c"]);
  });
});

describe("unicodeProperty auto-enables the u flag", () => {
  it("adds u for a bare property", () => {
    const re = regex().unicodeProperty("L").toRegExp();
    expect(re.flags).toContain("u");
    expect(re.test("A")).toBe(true);
    expect(re.test("5")).toBe(false);
  });

  it("adds u for a property with a value", () => {
    const re = regex().unicodeProperty("Script", "Greek").toRegExp();
    expect(re.flags).toContain("u");
    expect(re.source).toBe("\\p{Script=Greek}");
  });
});

// Compile-time only: never executed, but type-checked by `tsc --noEmit`.
// Negative assertions live here so the erroring property access is not run.
function _typeAssertions(): void {
  const one = regex().namedGroup("only", (b) => b.digit()).match("7");
  if (one) {
    // @ts-expect-error - "month" is not a declared named group on this pattern
    void one.groups.month;
  }
  const none = regex().digit().match("7");
  if (none) {
    // @ts-expect-error - a pattern with no named groups types groups as undefined
    void none.groups.anything;
  }
}
void _typeAssertions;

describe("typed group inference", () => {
  it("infers groups, stays backward compatible, and propagates through nesting", () => {
    // Backward compatibility: bare Builder still assignable.
    const bare: Builder = regex();
    expect(bare).toBeInstanceOf(Object);

    // Nested named group propagates to the outer type.
    const nested = regex().group((b) => b.namedGroup("inner", (x) => x.digit()));
    const nm = nested.match("5");
    expect(nm?.groups.inner).toBe("5");
    if (nm) {
      const inner: string = nm.groups.inner;
      expect(inner).toBe("5");
    }

    const om = regex().namedGroup("only", (b) => b.digit()).match("7");
    expect(om?.groups.only).toBe("7");
  });
});
