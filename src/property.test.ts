import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { regex } from "./index";

type BuilderMethod = (b: ReturnType<typeof regex>) => void;

const methods: BuilderMethod[] = [
  (b) => b.literal("a"),
  (b) => b.literal("cat"),
  (b) => b.digit(),
  (b) => b.word(),
  (b) => b.whitespace(),
  (b) => b.any(),
  (b) => b.letter(),
  (b) => b.anyOf("abc"),
  (b) => b.noneOf("xyz"),
  (b) => b.range("0", "9"),
  (b) => b.space(),
  (b) => b.wordBoundary(),
];

function tryBuild(methods: BuilderMethod[]): string | null {
  const builder = regex();
  for (const m of methods) {
    try {
      m(builder);
    } catch {
      return null;
    }
  }
  return builder.toString();
}

describe("property: builder output always compiles", () => {
  it("toString() can always be passed to new RegExp", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...methods), { minLength: 1, maxLength: 10 }),
        (cmds) => {
          const pattern = tryBuild(cmds);
          fc.pre(pattern !== null);
          expect(() => new RegExp(pattern!)).not.toThrow();
        }
      )
    );
  });
});

describe("property: matches is consistent with RegExp.test", () => {
  it("agrees for valid builder chains against arbitrary strings", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...methods), { minLength: 1, maxLength: 8 }),
        fc.string(),
        (cmds, input) => {
          const pattern = tryBuild(cmds);
          fc.pre(pattern !== null);
          const builder = regex();
          for (const m of cmds) {
            m(builder);
          }
          const re = new RegExp(pattern!);
          expect(builder.matches(input)).toBe(re.test(input));
        }
      )
    );
  });
});
