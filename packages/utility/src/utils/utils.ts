export function splitByKey<T>(items: T[], keyFn: (item: T) => string | undefined): Record<string, T[]> {
    const rv: Record<string, T[]> = {};
    items.forEach((item) => {
        const key = keyFn(item);
        key && (rv[key] || (rv[key] = [])).push(item);
    });
    return rv;
}

function shift(ch: string) {
    const code = ch.charCodeAt(0);
    return (ch >= 'a' && ch <= 'x') || (ch >= 'A' && ch <= 'X')
        ? String.fromCharCode((code + (code % 2 === 0 ? 1 : 2)))
        : ch;
}
