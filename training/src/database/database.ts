// import { Database } from "@nozbe/watermelondb";
// import { randomUUID } from "expo-crypto";

// import schema from "./data-model/schema";
// import migrations from "./data-model/migrations";
// import { createAdapter } from "./adapter";
// import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";

// import TrainingModule from "./data-model/models/TrainingModule";
// import TrainingEvent from "./data-model/models/TrainingEvent";
// import Village from "./data-model/models/Village";
// import Zone from "./data-model/models/Zone";
// import District from "./data-model/models/District";
// import Country from "./data-model/models/Country";

// setGenerator(() => randomUUID());

// const database = new Database({
//     adapter: createAdapter({ schema /*, migrations*/ }),
//     modelClasses: [
//         TrainingModule,
//         TrainingEvent,
//         Village,
//         // Zone,
//         // District,
//         // Country,
//     ],
// });

// export default database;

// export const trainingModuleCollection =
//     database.get<TrainingModule>("training_module");
// export const trainingEventCollection =
//     database.get<TrainingEvent>("training_event");
// export const villageCollection = database.get<Village>("village");
// export const zoneCollection = database.get<Zone>("zone");
// export const districtCollection = database.get<District>("district");
// export const countryCollection = database.get<Country>("country");
