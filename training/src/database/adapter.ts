// This was copied right from https://github.com/Nozbe/WatermelonDB/issues/1796

import { type LokiAdapterOptions } from "@nozbe/watermelondb/adapters/lokijs";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { SQLiteAdapterOptions } from "@nozbe/watermelondb/adapters/sqlite/type";

export const createAdapter = (
    options: Pick<
        SQLiteAdapterOptions,
        Extract<keyof SQLiteAdapterOptions, keyof LokiAdapterOptions>
    >
) =>
    new SQLiteAdapter({
        jsi: false,
        ...options,
    });
