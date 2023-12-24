export const equal = Symbol();

function equalImpl<T>(this: Array<T>, array?: Array<T>): boolean {
    if (!array) return false;
    return JSON.stringify(array) === JSON.stringify(this);
}

declare global {
    interface Array<T> {
        [equal]: typeof equalImpl<T>;
        equal: typeof equalImpl<T>;
    }
}

Array.prototype[equal] = equalImpl;
Array.prototype.equal = equalImpl;

export {};
