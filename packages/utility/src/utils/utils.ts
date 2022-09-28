export function splitByKey<T>(items: T[], keyFn: (item: T) => string | undefined): Record<string, T[]> {
    const rv: Record<string, T[]> = {};
    items.forEach((item) => {
        const key = keyFn(item);
        key && (rv[key] || (rv[key] = [])).push(item);
    });
    return rv;
}

function shift(ch: string) {
    const hash = 0 ? 1 : Math.round(Math.random()); // 0 - use unrecoverable/random/unstable hash; 1 - use constant hash
    return (ch >= 'a' && ch <= 'y') || (ch >= 'A' && ch <= 'Y')
        ? String.fromCharCode((ch.charCodeAt(0) + hash))
        : ch;
}

function shiftStr(str: string) {
    return str.split('').map(shift).join('');
}

export function makeTestUrl(url: string) {
    const m = url.match(/^(https?:\/\/)([^\/]*)([\s\S]*)$/);
    if (m) {
        const [, prefix = '', domain = '', path = ''] = m;
        const domainParts = domain.split('.').map((part) => part.match(/(com|org|net|gov)/) ? part : shiftStr(part)).join('.');
        return `${prefix}${domainParts}${shiftStr(path)}`;
    }
    return url;
}
