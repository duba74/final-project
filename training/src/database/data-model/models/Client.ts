import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    children,
    writer,
    immutableRelation,
    nochange,
} from "@nozbe/watermelondb/decorators";
import Village from "./Village";
import Participant from "./Participant";

export default class Client extends Model {
    static table = "client";
    static associations = {
        village: { type: <const>"belongs_to", key: "village" },
        participant: { type: <const>"has_many", foreignKey: "client" },
    };

    @nochange @field("first_name") firstName!: string;
    @nochange @field("last_name") lastName!: string | null;
    @nochange @field("sex") sex!: string | null;
    @nochange @field("age_group") ageGroup!: string | null;
    @nochange @field("phone_1") phone1!: string | null;
    @nochange @field("phone_2") phone2!: string | null;
    @nochange @field("is_leader") isLeader!: boolean;

    @immutableRelation("village", "village") village!: Relation<Village>;

    @children("participant") participants!: Query<Participant>;

    // Writer for Participant?
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
