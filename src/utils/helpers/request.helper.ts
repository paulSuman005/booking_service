import { AsyncLocalStorage } from "node:async_hooks";

type AsyncLoacalStorageType = {
    correlationId : string;
}

export const asyncLocalStorage = new AsyncLocalStorage<AsyncLoacalStorageType>();

export const getCorrelationId = () => {
    const asyncStore = asyncLocalStorage.getStore();
    return asyncStore?.correlationId || "error-while-fetching-correlationId";
}