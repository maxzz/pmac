import tty from "node:tty";

export type Formatter = (input: string | number | null | undefined) => string;

export interface Colors {
    isColorSupported: boolean;

    reset: Formatter;
    bold: Formatter;
    dim: Formatter;
    italic: Formatter;
    underline: Formatter;
    inverse: Formatter;
    hidden: Formatter;
    strikethrough: Formatter;

    black: Formatter;
    red: Formatter;
    green: Formatter;
    yellow: Formatter;
    blue: Formatter;
    magenta: Formatter;
    cyan: Formatter;
    white: Formatter;

    gray: Formatter;

    blackBright: Formatter;
    redBright: Formatter;
    greenBright: Formatter;
    yellowBright: Formatter;
    blueBright: Formatter;
    magentaBright: Formatter;
    cyanBright: Formatter;
    whiteBright: Formatter;

    bgBlack: Formatter;
    bgRed: Formatter;
    bgGreen: Formatter;
    bgYellow: Formatter;
    bgBlue: Formatter;
    bgMagenta: Formatter;
    bgCyan: Formatter;
    bgWhite: Formatter;
}

const isColorSupported =
    !("NO_COLOR" in process.env || process.argv.includes("--no-color")) &&
    ("FORCE_COLOR" in process.env ||
        process.argv.includes("--color") ||
        process.platform === "win32" ||
        (tty.isatty(1) && process.env.TERM !== "dumb") ||
        "CI" in process.env);

const replaceClose = (str: string, close: string, replace: string, index: number): string => {
    const start = str.substring(0, index) + replace;
    const end = str.substring(index + close.length);
    const nextIndex = end.indexOf(close);
    return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
};

export const formatter = (open: string, close: string, replace = open): Formatter => (input: string | number | null | undefined) => {
    const str = "" + input;
    const index = str.indexOf(close, open.length);
    return ~index
        ? open + replaceClose(str, close, replace, index) + close
        : open + str + close;
};

export const createColors = (enabled = isColorSupported): Colors => ({
    isColorSupported: enabled,

    reset: enabled ? (s: string | number | null | undefined) => `\x1b[0m${s}\x1b[0m` : String,
    bold: enabled ? formatter("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m") : String,
    dim: enabled ? formatter("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m") : String,
    italic: enabled ? formatter("\x1b[3m", "\x1b[23m") : String,
    underline: enabled ? formatter("\x1b[4m", "\x1b[24m") : String,
    inverse: enabled ? formatter("\x1b[7m", "\x1b[27m") : String,
    hidden: enabled ? formatter("\x1b[8m", "\x1b[28m") : String,
    strikethrough: enabled ? formatter("\x1b[9m", "\x1b[29m") : String,

    black: enabled ? formatter("\x1b[30m", "\x1b[39m") : String,
    red: enabled ? formatter("\x1b[31m", "\x1b[39m") : String,
    green: enabled ? formatter("\x1b[32m", "\x1b[39m") : String,
    yellow: enabled ? formatter("\x1b[33m", "\x1b[39m") : String,
    blue: enabled ? formatter("\x1b[34m", "\x1b[39m") : String,
    magenta: enabled ? formatter("\x1b[35m", "\x1b[39m") : String,
    cyan: enabled ? formatter("\x1b[36m", "\x1b[39m") : String,
    white: enabled ? formatter("\x1b[37m", "\x1b[39m") : String,

    gray: enabled ? formatter("\x1b[90m", "\x1b[39m") : String,

    blackBright: enabled ? formatter("\x1b[90m", "\x1b[39m") : String,
    redBright: enabled ? formatter("\x1b[91m", "\x1b[39m") : String,
    greenBright: enabled ? formatter("\x1b[92m", "\x1b[39m") : String,
    yellowBright: enabled ? formatter("\x1b[93m", "\x1b[39m") : String,
    blueBright: enabled ? formatter("\x1b[94m", "\x1b[39m") : String,
    magentaBright: enabled ? formatter("\x1b[95m", "\x1b[39m") : String,
    cyanBright: enabled ? formatter("\x1b[96m", "\x1b[39m") : String,
    whiteBright: enabled ? formatter("\x1b[97m", "\x1b[39m") : String,

    bgBlack: enabled ? formatter("\x1b[40m", "\x1b[49m") : String,
    bgRed: enabled ? formatter("\x1b[41m", "\x1b[49m") : String,
    bgGreen: enabled ? formatter("\x1b[42m", "\x1b[49m") : String,
    bgYellow: enabled ? formatter("\x1b[43m", "\x1b[49m") : String,
    bgBlue: enabled ? formatter("\x1b[44m", "\x1b[49m") : String,
    bgMagenta: enabled ? formatter("\x1b[45m", "\x1b[49m") : String,
    bgCyan: enabled ? formatter("\x1b[46m", "\x1b[49m") : String,
    bgWhite: enabled ? formatter("\x1b[47m", "\x1b[49m") : String,
});

export default createColors;
