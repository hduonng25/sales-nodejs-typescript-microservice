export function resolveValue(obj: object, path: string): unknown {
    const paths = path.split('.');
    for (const path of paths) {
        try {
            obj = Reflect.get(obj, path);
        } catch (error) {
            return undefined;
        }
    }

    return obj;
}
