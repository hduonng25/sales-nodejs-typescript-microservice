import { createHook, executionAsyncId } from 'async_hooks';

const store: Map<number, string | undefined> = new Map();

const hook = createHook({
    init: (asyncId, _, triggerAsyncId) => {
        const data = store.get(triggerAsyncId);
        if (store.has(triggerAsyncId)) {
            store.set(asyncId, data);
        }
    },
    destroy(asyncId) {
        if (store.has(asyncId)) {
            store.delete(asyncId);
        }
    },
});

hook.enable();

export const setCorrelationId = (id: string): void => {
    const execId = executionAsyncId();
    store.set(execId, id);
};

export const getCorrelationId = (): string | undefined => {
    const execId = executionAsyncId();
    return store.get(execId);
};
