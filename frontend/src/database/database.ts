import { Database } from "@nozbe/watermelondb";
import { randomUUID } from "expo-crypto";

import schema from "./model/schema";
import migrations from "./model/migrations";
import { createAdapter } from "./adapter";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";

import TrainingModule from "./model/TrainingModule";
import TrainingEvent from "./model/TrainingEvent";

setGenerator(() => randomUUID());

const database = new Database({
    adapter: createAdapter({ schema /*, migrations*/ }),
    modelClasses: [TrainingModule, TrainingEvent],
});

export default database;

export const trainingModuleCollection =
    database.get<TrainingModule>("training_module");
export const trainingEventCollection =
    database.get<TrainingEvent>("training_event");
