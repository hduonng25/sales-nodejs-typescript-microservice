export function isNullOrUndefined(test: unknown): boolean {
    return typeof test === 'undefined' || test === null;
}

export function isString(test: unknown): test is string {
    return !notString(test);
}

export function notString(test: unknown): boolean {
    return typeof test !== 'string';
}
