// This was copied right from https://github.com/Nozbe/WatermelonDB/issues/1796
import LokiJSAdapter, {
    type LokiAdapterOptions,
} from "@nozbe/watermelondb/adapters/lokijs";
import { type SQLiteAdapterOptions } from "@nozbe/watermelondb/adapters/sqlite/type";

export const createAdapter = (
    options: Pick<
        LokiAdapterOptions,
        Extract<keyof LokiAdapterOptions, keyof SQLiteAdapterOptions>
    >
) =>
    new LokiJSAdapter({
        useWebWorker: false,
        useIncrementalIndexedDB: true,
        ...options,
    });
