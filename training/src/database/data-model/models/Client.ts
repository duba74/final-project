import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    date,
    readonly,
    children,
    writer,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import Village from "./Village";
// import Participant from "./Participant ";

export default class Client extends Model {
    static table = "client";
    static associations = {
        village: { type: <const>"belongs_to", key: "village" },
        // participant: {
        //     type: <const>"has_many",
        //     foreignKey: "training_module",
        // },
    };

    @readonly @field("first_name") firstName!: string;
    @readonly @field("last_name") lastName!: string;
    @readonly @field("sex") sex!: string;
    @readonly @field("age_group") ageGroup!: string;
    @readonly @field("phone_1") phone1!: string;
    @readonly @field("phone_2") phone2!: string;
    @readonly @field("is_leader") isLeader!: string;

    @immutableRelation("village", "village") village!: Relation<Village>;

    // @children("training_event") trainingEvents!: Query<TrainingEvent>;

    // @writer async addTrainingEvent(scheduledFor: string | Date = "2024-12-01") {
    //     const newTrainingEvent = await this.collections
    //         .get<TrainingEvent>("training_event")
    //         .create((trainingEvent) => {
    //             trainingEvent.trainingModule.set(this);
    //             trainingEvent.scheduledFor =
    //                 scheduledFor instanceof Date
    //                     ? scheduledFor.getTime()
    //                     : new Date(scheduledFor).getTime();
    //         });

    //     return newTrainingEvent;
    // }
}
