import { describe, expect, it } from "vitest";
import {
  hexColorPattern,
  hexColorRegex,
  presetsRegistry,
  uuidPatternBasic,
  uuidRegexBasic
} from "./presets";

describe("presets module", () => {
  it("exposes a scoped presets registry", () => {
    expect(presetsRegistry.uuidPatternBasic).toBe(uuidPatternBasic);
    expect(presetsRegistry.hexColorPattern).toBe(hexColorPattern);
    expect(presetsRegistry.uuidRegexBasic).toBeInstanceOf(RegExp);
    expect(presetsRegistry.hexColorRegex).toBeInstanceOf(RegExp);
  });

  it("validates UUID v4 basic pattern", () => {
    expect(uuidRegexBasic.test("f47ac10b-58cc-4372-a567-0e02b2c3d479")).toBe(true);
    expect(uuidRegexBasic.test("F47AC10B-58CC-4372-A567-0E02B2C3D479")).toBe(true);
    expect(uuidRegexBasic.test("not-a-uuid")).toBe(false);
  });

  it("validates hex color pattern", () => {
    expect(hexColorRegex.test("#fff")).toBe(true);
    expect(hexColorRegex.test("#ffffff")).toBe(true);
    expect(hexColorRegex.test("abc123")).toBe(true);
    expect(hexColorRegex.test("#abcd")) .toBe(false);
  });
});
