export function splitByKey<T>(items: T[], keyFn: (item: T) => string | undefined): Record<string, T[]> {
    const rv: Record<string, T[]> = {};
    items.forEach((item) => {
        const key = keyFn(item);
        key && (rv[key] || (rv[key] = [])).push(item);
    });
    return rv;
}

const useStable = 0; // 0 - use unrecoverable/random/unstable hash; 1 - use constant hash

function shift(ch: string) {
    const hash = useStable ? 1 : Math.round(Math.random());
    return (
        ch === 'z'
            ? 'a'
            : ch === 'Z'
                ? 'A'
                : (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')
                    ? String.fromCharCode((ch.charCodeAt(0) + hash))
                    : ch
    );
}

function hashStr(str: string) {
    return str.split('').map(shift).join('');
}

export function makeTestUrl(url: string) {
    const m = url.match(/^(https?:\/\/)([^\/]*)([\s\S]*)$/);
    if (m) {
        const [, prefix = '', domain = '', path = ''] = m;
        const domainParts = domain.split('.').map((part) => part.match(/(com|org|net|gov)/) ? part : hashStr(part)).join('.');
        return `${prefix}${domainParts}${hashStr(path)}`;
    }
    return url;
}
