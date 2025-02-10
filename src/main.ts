/** Log levels */
export enum Level {
    /** Messages only useful for debugging */
    debug = 0,
    /** General messages about the state of the program */
    info = 1,
    /**
     * It is unceratin if something has gone wrong or not,
     * but the circumstances would be worth investigation
     */
    warn = 2,
    /** A bug has been detected or something has gone wrong but it is recoverable */
    err = 3,
    /** Prevents any further logging */
    none = 4,
}

const levelStr: Record<Level, string> = <const>{
    [Level.debug]: "debug",
    [Level.info]: "info",
    [Level.warn]: "warn",
    [Level.err]: "error",
    [Level.none]: "nolog",
};

/**
 * A controller from which scopes can be created and controlled.
 * This can be given to a library which supports zlog.
 */
export class Master {
    /** Scopes tracked by this master  */
    scopes: Map<symbol, Scope> = new Map();
    constructor(
        /** The default level for scopes created by this master */
        public defaultLevel: Level = Level.info
    ) {}

    /**
     * Creates a new scope with the given name and level.
     * If the scope already exists, it is returned.
     *
     * @param sym The symbol to create the scope for
     * @param level The log level for the scope
     */
    scope(sym: symbol, level: Level = this.defaultLevel): Scope {
        if (this.scopes.has(sym)) return this.scopes.get(sym)!;
        const scope = new Scope(this, sym, level);
        this.scopes.set(sym, scope);
        return scope;
    }

    /**
     * Set the log level for the given symbol.
     * If the scope does not exist, it is created.
     *
     * @param sym The symbol to set the level for
     * @param level The log level to set
     */
    set(sym: symbol, level: Level = this.defaultLevel): Scope {
        const scope = this.scopes.get(sym) ?? this.scope(sym, level);
        scope.level = level;
        return scope;
    }
}

/** A scope for logging */
export class Scope {
    /** The name of the scope used for logging */
    readonly name: string;
    constructor(
        /** The master that created this scope */
        readonly master: Master,
        /** The symbol that this scope is for */
        readonly sym: symbol,
        /** The log level for this scope */
        public level: Level
    ) {
        this.name = this.sym.description ?? "unknown";
    }

    #fmt(message: string): string {
        return `${levelStr[this.level]}(${this.name}): ${message}\n`;
    }

    #log(message: string, level: Level): void {
        if (this.level > level) return;
        Deno.stdout.writeSync(new TextEncoder().encode(this.#fmt(message)));
    }

    /** Log a message at the debug level to the standard error */
    debug(message: string): void {
        this.#log(message, Level.debug);
    }

    /** Log a message at the info level to the standard error */
    info(message: string): void {
        this.#log(message, Level.info);
    }

    /** Log a message at the warn level to the standard error */
    warn(message: string): void {
        this.#log(message, Level.warn);
    }

    /** Log a message at the error level to the standard error */
    err(message: string): void {
        this.#log(message, Level.err);
    }
}
