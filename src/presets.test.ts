import { describe, expect, it } from "vitest";
import {
  isoDateRegexBasic,
  isoDatePatternBasic,
  hexColorPattern,
  hexColorRegex,
  presetsRegistry,
  usernameRegexBasic,
  usernamePatternBasic,
  uuidPatternBasic,
  uuidRegexBasic
} from "./presets";

describe("presets module", () => {
  it("exposes a scoped presets registry", () => {
    expect(presetsRegistry.uuidPatternBasic).toBe(uuidPatternBasic);
    expect(presetsRegistry.hexColorPattern).toBe(hexColorPattern);
    expect(presetsRegistry.uuidRegexBasic).toBeInstanceOf(RegExp);
    expect(presetsRegistry.hexColorRegex).toBeInstanceOf(RegExp);
    expect(presetsRegistry.isoDatePatternBasic).toBe(isoDatePatternBasic);
    expect(presetsRegistry.usernamePatternBasic).toBe(usernamePatternBasic);
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
    expect(hexColorRegex.test("#abcd")).toBe(false);
  });

  it("validates ISO date basic pattern", () => {
    expect(isoDateRegexBasic.test("2026-05-10")).toBe(true);
    expect(isoDateRegexBasic.test("26-05-10")).toBe(false);
    expect(isoDateRegexBasic.test("2026/05/10")).toBe(false);
  });

  it("validates username basic pattern", () => {
    expect(usernameRegexBasic.test("abc")).toBe(true);
    expect(usernameRegexBasic.test("user_name_123")).toBe(true);
    expect(usernameRegexBasic.test("ab")).toBe(false);
    expect(usernameRegexBasic.test("user-name")).toBe(false);
  });
});
