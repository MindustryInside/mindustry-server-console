// Type definitions for Mindustry Server Console 1.0.0
// Project: http://github.com/Summet-V/Mindustry-Server-Console
// Definitions by: Andrew Antsiferov <https://github.com/Summet-V>

/// <reference types="electron" />

declare namespace ServerConsole {
    // region main
    /**
     * Main options interface.
     */
    interface Options {
        resourcePath: string;
        serverPath: string;
        dev?: boolean;
    }

    /**
     * Startup time utility.
     */
    const startupTime: {
        /**
         * Set current time; Call before app start.
         */
        set(): void;

        /**
         * Get timestamp from {@link set}.
         */
        getTimestamp(): number;
    }

    /**
     * Main class for app.
     */
    class ServerApplication {
        public opened: boolean;
        public serverWindow: ServerWindow;
        public server: Server;

        /**
         * An entry point to an app.
         * @param options: {@link Options} object.
         */
        public static open(options: Options): void;

        /**
         * Close electron app.
         */
        public static exit(): never;
    }

    /**
     * Main class for creating {@link Electron.BrowserWindow}.
     */
    class ServerWindow {
        constructor(options: Options);

        public browserWindow: Electron.BrowserWindow;

        /**
         * Create and show window.
         */
        public createWindow(): void;

        /**
         * Handle events from window.
         */
        public handleWindowEvents(): void;
    }

    /**
     * Main class for controlling {@link https://github.com/Anuken/Mindustry} server.
     */
    class Server extends NodeJS.EventEmitter {
        constructor(options: Options);

        public loaded: boolean;
        public serverPath: string;
        public serverProcess: NodeJS.Process;

        on(event: 'output', listener: (data: string) => void): this;
        once(event: 'output', listener: (data: string) => void): this;
        addListener(event: 'output', listener: (data: string) => void): this;
        removeListener(event: 'output', listener: (data: string) => void): this;

        on(event: 'playerConnect', listener: (player: string) => void): this;
        once(event: 'playerConnect', listener: (player: string) => void): this;
        addListener(event: 'playerConnect', listener: (player: string) => void): this;
        removeListener(event: 'playerConnect', listener: (player: string) => void): this;

        on(event: 'playerDisconnect', listener: (player: string) => void): this;
        once(event: 'playerDisconnect', listener: (player: string) => void): this;
        addListener(event: 'playerDisconnect', listener: (player: string) => void): this;
        removeListener(event: 'playerDisconnect', listener: (player: string) => void): this;

        /**
         * Starts server process.
         */
        public start(): void;

        /**
         * Handle server events.
         */
        public handleEvents(): void;

        /**
         * Write to server stream.
         * @param text: Text to write.
         */
        public write(text: string): void;

        /**
         * Send a command to the server.
         * @param command: Command to send.
         */
        public command(command: string): void;

        /**
         * Restart the server.
         */
        public restart(): void;

        /**
         * Kill server process.
         */
        public exit(): void;
    }

    /**
     * Function to handle any error in app.
     * @param error: Error to handle.
     */
    function errorHandler(error: Error): never;

    /**
     * Parse command line arguments;
     * @param argv: Arguments to parse.
     */
    function parseCommandLine(argv: string[]): object;

    // endregion

    // region renderer

    /**
     * Interface for server command.
     */
    interface Command {
        name: string;
        listener: () => {};
    }

    /**
     * Locale template.
     */
    interface MenuLocale {
        "menu-players": string;
        "menu-statistics": string;
        "menu-maps": string;
        "menu-mods": string;
        "menu-plugins": string;
        "menu-host": string;
        "menu-stop": string;
        "menu-break": string;
        "menu-server-folder": string;
    }

    /**
     * Color template.
     */
    interface MenuColor {
        color: string;
        value: string;
    }

    /**
     * An entry point to renderer process.
     */
    class Console {
        public titlebar: Titlebar;
        public menu: Menu;
        public players: Players;
        public transations: Translations;
        public colorSwitcher: ColorSwitcher;

        public logElement: HTMLElement;
        public inputElement: HTMLElement;

        public lastCommands: string[];
        public lastCommandsState: number;
        public customCommands: Command[];

        /**
         * Setup the console.
         */
        public setup(): void;

        /**
         * Add keybinds.
         */
        public setupKeybinds(): void;

        /**
         * Restart the console.
         */
        public restart(): void;

        /**
         * Set color of the console.
         * @param color: Color to set.
         */
        public setColor(color: string): void;

        /**
         * Switch to next color.
         */
        public nextColor(): void;

        /**
         * Set language of the console.
         * @param language: Lannguage to set.
         */
        public setLang(language: string): void;

        /**
         * Switch to next language.
         */
        public nextLang(): void;

        /**
         * Add new keybind.
         * @param key: Key for bind.
         * @param listener: Listener fot keybind.
         */
        public addKeybind(key: string, listener: () => {}): void;

        /**
         * Add new `control` keybind.
         * @param key: Key for bind.
         * @param listener: Listener fot keybind.
         */
        public addCtrlKeybind(key: string, listener: () => {}): void;

        /**
         * Add custom command to the console command line.
         * @param command: Command name.
         * @param listener: Listener for command.
         */
        public addCommand(command: string, listener: () => {}): void;

        /**
         * Clear command line.
         */
        public clearInput(): void;

        /**
         * Log message to console log.
         * @param message: Message to send.
         */
        public logMessage(message: string): void;

        /**
         * Scroll down to bottom.
         */
        public scrollDown(): void;

        /**
         * Exit the console.
         */
        public exit(): never;
    }

    // TODO: Finish types documentation

    class Titlebar {
        public buttons: Element[];
        public closeBtn: HTMLElement;
        public maximizeBtn: HTMLElement;
        public minimizeBtn: HTMLElement;

        public set(): void;
    }

    class Menu {
        public cpuRotateElement: HTMLElement;
        public cpuValueElement: HTMLElement;
        public ramRotateElement: HTMLElement;
        public ramValueElement: HTMLElement;

        public hostButton: HTMLElement;
        public stopButton: HTMLElement;
        public breakButton: HTMLElement;
        public folderButton: HTMLElement;

        public setup(): void;

        public update(): void;

        public setRamUsage(value: number): void;

        public setCpuUsage(value: number): void;
    }

    class Players {
        public playersElement: HTMLElement;
        public players: Set<string>;

        public handleEvents(): void;

        public handleConnect(playerName: string): void;

        public handleDisconnect(playerName: string): void;

        public updatePlayers(): void;
    }

    class Translations {
        constructor(defaultLanguage?: string);

        public lang: string;
        public elements: HTMLCollectionOf<Element>;
        public locales: MenuLocale[];
        public generator: Generator<MenuLocale>;

        public initTranslations(): void;

        public update(): void;

        public setLang(language: string): void;

        public getValue(key: string): string;

        public nextLang(): void;
    }

    class ColorSwitcher {
        constructor(defaultColor?: string);

        public scrollbarStyleElement: HTMLStyleElement;
        public colors: MenuColor[];
        public currentColor: string;
        public generator: Generator<MenuColor>;

        public setup(): void;

        public update(): void;

        public setColor(color: string): void;

        public getColor(key: string): string;

        public nextColor(): void;

        public setScrollbarColor(color: string): void;
    }

    class Generator<T> {
        public array: T[];
        public pos: number;

        public next(): T;
    }

    function cpuUsagePercent(): Promise<number>;

    function ramUsagePercent(): number;

    function parseName(rawName: string): string;

    // endregion
}

declare module 'server-console' {
    export = ServerConsole;
}
