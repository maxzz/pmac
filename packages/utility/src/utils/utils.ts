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
        // ? String.fromCharCode((code + (code % 2 === 0 ? 1 : 2)))
        ? String.fromCharCode((code + 1))
        : ch;
}

function shiftStr(str: string) {
    return str.split('').map(shift).join('');
}

export function makeTestUrl(url: string) {
    const m = url.match(/^(https?:\/\/)([^\/]*)([\s\S]*)$/);
    if (m) {
        const prefix = m[1] || '';
        const domain = m[2] || '';
        const path = m[3] || '';
        return `${prefix}${shiftStr(domain)}${shiftStr(path)}`;
    }
    return url;
}
