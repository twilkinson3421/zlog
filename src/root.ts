/**
 * A simple logging library for Deno, inspired by Zig's `std.log`. Has support for scopes and levels.
 * @module
 *
 * @example
 * ```ts
 * import * as zlog from "@zerm/zlog";
 *
 * const master = new zlog.Master();
 * master.set(Symbol.for("myLibrary"), zlog.Level.warn);
 *
 * myLibrary.init(master);
 *
 * // ...inside myLibrary
 *
 * let log: zlog.Scope;
 *
 * export function init(master: zlog.Master = new zlog.Master()): void {
 *     log = master.scope(Symbol.for("myLibrary"));
 *
 *     // These will be hidden
 *     log.debug("This is a debug message");
 *     log.info("This is an info message");
 *
 *     // These will be shown
 *     log.warn("This is a warning message");
 *     log.err("This is an error message");
 * }
 * ```
 *
 * The use of symbols allows libraries to be configured using `Symbol.for`,
 * or be made unique by using a regular `Symbol`. This prevents scope collisions,
 * but means that the library should expose its symbol(s) to the caller for configuration.
 */

export * from "./main.ts";
