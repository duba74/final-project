import { Database } from "@nozbe/watermelondb";
import { randomUUID } from "expo-crypto";

import schema from "./model/schema";
import migrations from "./model/migrations";
import { createAdapter } from "./adapter";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";

import Item from "./model/Item";

setGenerator(() => randomUUID());

const database = new Database({
    adapter: createAdapter({ schema /*, migrations*/ }),
    modelClasses: [Item],
});

export default database;

export const itemsCollection = database.get<Item>("items");
