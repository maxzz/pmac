export function splitByKey<T>(items: T[], keyFn: (item: T) => string | undefined): Record<string, T[]> {
    const rv: Record<string, T[]> = {};
    items.forEach((item) => {
        const key = keyFn(item);
        key && (rv[key] || (rv[key] = [])).push(item);
    });
    return rv;
}
