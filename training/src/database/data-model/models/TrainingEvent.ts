import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    children,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import TrainingModule from "./TrainingModule";
import Village from "./Village";
import Participant from "./Participant";

export default class TrainingEvent extends Model {
    static table = "training_event";
    static associations = {
        training_module: { type: <const>"belongs_to", key: "training_module" },
        village: { type: <const>"belongs_to", key: "village" },
        participant: { type: <const>"has_many", foreignKey: "training_event" },
    };

    @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @date("scheduled_for") scheduledFor!: number;
    @field("scheduled_time") scheduledTime!: string;
    @field("is_canceled") isCanceled!: boolean;
    @nochange @date("completed_at") completedAt!: number;
    @nochange @field("location") location!: string;
    @text("comments") comments!: string;

    @immutableRelation("training_module", "training_module")
    trainingModule!: Relation<TrainingModule>;
    @immutableRelation("village", "village") village!: Relation<Village>;

    @children("participant") participants!: Query<Participant>;
}
