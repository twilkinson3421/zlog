/**
 * A simple logging library for Deno, inspired by Zig's `std.log`. Has support for scopes and levels.
 * @module
 *
 * @example
 * ```ts
 * import * as zlog from "@zerm/zlog";
 *
 * const controller = new zlog.Controller(); // default level is `debug`
 *
 * controller.set(Symbol.for("someLibrary"), zlog.Level.warn); // set the level for a library
 * controller.lock(Symbol.for("someLibrary")); // lock the level for a library
 *
 * someLibrary.init(controller); // give the controller to a library which supports zlog
 *
 * // ...someLibrary
 *
 * export function init(controller: zlog.Controller) {
 *     // this can be stored somewhere for later use
 *     const log = controller.scope(Symbol.for("someLibrary"));
 *
 *     log.debug("This is a debug message");
 *     log.info("This is an info message");
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
