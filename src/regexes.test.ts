import { describe, expect, it } from "vitest";
import { identifierPattern, identifierRegex, slugPattern, slugRegex } from "./regexes";

describe("regex registry", () => {
  it("builds slug pattern and regex", () => {
    expect(slugPattern).toBe("^\\w+(?:-\\w+)*$");
    expect(slugRegex).toBeInstanceOf(RegExp);
    expect(slugRegex.source).toBe("^\\w+(?:-\\w+)*$");
  });

  it("builds identifier pattern and regex", () => {
    expect(identifierPattern).toBe("^\\w+$");
    expect(identifierRegex).toBeInstanceOf(RegExp);
    expect(identifierRegex.source).toBe("^\\w+$");
  });
});
