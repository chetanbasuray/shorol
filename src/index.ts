/**
 * Fluent, chainable regex builder class.
 *
 * @example
 * ```ts
 * import { Builder } from "shorol";
 *
 * const builder = new Builder().start().literal("cat").end();
 * builder.toRegExp(); // /^cat$/
 * ```
 */
export { Builder } from "./builder";

/**
 * Create a new `Builder` instance.
 *
 * @example
 * ```ts
 * import { regex } from "shorol";
 *
 * const re = regex().digit().repeat(3).toRegExp();
 * ```
 */
export { regex } from "./builder";

/**
 * Prebuilt regex registry helpers and patterns.
 *
 * @example
 * ```ts
 * import { slugRegex } from "shorol";
 *
 * slugRegex.test("my-post-slug"); // true
 * ```
 */
export * from "./regexes";

/**
 * Scoped presets for common patterns (uuid, hex color, etc.).
 * Import from `shorol/presets` for module-scoped semantics.
 */
export * from "./presets";
