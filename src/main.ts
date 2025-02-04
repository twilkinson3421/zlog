/** Log levels */
export enum Level {
    /** Messages only useful for debugging */
    debug = 0,
    /** General messages about the state of the program */
    info = 1,
    /**
     * It is unceratin if something has gone wrong or not,
     * but the circumstances would be worth investigation.
     */
    warn = 2,
    /** A bug has been detected or something has gone wrong but is is recoverable */
    err = 3,
    /** Prevents any further logging */
    none = 4,
}

/**
 * A controller from which scopes can be created and controlled.
 * This should be given to a library which supports zlog.
 */
export class Controller {
    #scopes: Map<symbol, Scope> = new Map();

    constructor(
        /** The default log level for scopes which have not been configured */
        public defaultLevel: Level = Level.info
    ) {}

    /**
     * Creates a new scope with the given symbol and level.
     * If the scope already exists, it will be returned.
     *
     * @param symbol The symbol with which to identify the scope
     * @param level The log level for the scope
     * @returns A {@link Scope}
     */
    scope(symbol: symbol, level: Level = this.defaultLevel): Scope {
        if (this.#scopes.has(symbol)) return this.#scopes.get(symbol)!;
        const scope = new Scope(symbol, level, this.#scopes.size.toString());
        this.#scopes.set(symbol, scope);
        return scope;
    }

    /**
     * Sets the log level for the given symbol.
     * If the scope does not exist, it will be created with the given level.
     * If the scope has been locked, nothing will happen.
     *
     * @param symbol The symbol with which to identify the scope
     * @param level The log level for the scope
     * @returns The referenced {@link Scope}
     */
    set(symbol: symbol, level: Level): Scope {
        const scope = this.#scopes.get(symbol) ?? this.scope(symbol, level);
        scope.level = level;
        return scope;
    }

    /**
     * Locks the log level for the scope with the given symbol.
     * If the scope does not exist, it will be created with the default level and locked.
     *
     * This action cannot be undone.
     *
     * @param symbol The symbol with which to identify the scope
     */
    lock(symbol: symbol): void {
        this.set(symbol, (this.#scopes.get(symbol) ?? { level: this.defaultLevel }).level).locked =
            true;
    }
}

export class Scope {
    /** The plaintext name for the scope */
    readonly name: string;
    #locked = false;

    /** Whether the scope is locked */
    get locked(): boolean {
        return this.#locked;
    }

    /** Whether the scope is locked. Cannot be unlocked after being locked. */
    set locked(value: boolean) {
        if (this.locked) return;
        this.#locked = value;
    }

    #level: Level;

    /** The log level for the scope */
    get level(): Level {
        return this.#level;
    }

    /** The log level for the scope. Cannot be changed if the scope is locked. */
    set level(value: Level) {
        if (this.locked) return;
        this.#level = value;
    }

    constructor(public symbol: symbol, level: Level, fallback: string) {
        this.name = symbol.description ?? fallback;
        this.#level = level;
    }

    private logFn(message: string, level: Level): void {
        if (this.level > level) return;
        const output = `${Level[level]}(${this.name}): ${message}\n`;
        const fd = level === Level.info ? Deno.stdout : Deno.stderr;
        fd.writeSync(new TextEncoder().encode(output));
    }

    /** Logs a 'debug' message to `stderr` */
    debug(message: string): void {
        this.logFn(message, Level.debug);
    }

    /** Logs an 'info' message to `stdout` */
    info(message: string): void {
        this.logFn(message, Level.info);
    }

    /** Logs a 'warning' message to `stderr` */
    warn(message: string): void {
        this.logFn(message, Level.warn);
    }

    /** Logs an 'error' message to `stderr` */
    err(message: string): void {
        this.logFn(message, Level.err);
    }
}
