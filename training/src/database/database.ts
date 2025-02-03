import { Database } from "@nozbe/watermelondb";
import { randomUUID } from "expo-crypto";

import schema from "./data-model/schema";
import migrations from "./data-model/migrations";
import { createAdapter } from "./adapter";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";

import TrainingModule from "./data-model/models/TrainingModule";
import TrainingEvent from "./data-model/models/TrainingEvent";
import Village from "./data-model/models/Village";
import Client from "./data-model/models/Client";
import Assignment from "./data-model/models/Assignment";
import Participant from "./data-model/models/Participant";
import Staff from "./data-model/models/Staff";

setGenerator(() => randomUUID().toString());

const database = new Database({
    adapter: createAdapter({ schema /*, migrations*/ }),
    modelClasses: [
        TrainingModule,
        TrainingEvent,
        Village,
        Client,
        Assignment,
        Participant,
        Staff,
    ],
});

export default database;

export const trainingModuleCollection =
    database.get<TrainingModule>("training_module");
export const trainingEventCollection =
    database.get<TrainingEvent>("training_event");
export const villageCollection = database.get<Village>("village");
export const clientCollection = database.get<Client>("client");
export const staffCollection = database.get<Staff>("staff");
export const assignmentCollection = database.get<Assignment>("assignment");
