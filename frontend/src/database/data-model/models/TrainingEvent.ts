import { Model, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import TrainingModule from "../TrainingModule";
import Village from "./Village";

export default class TrainingEvent extends Model {
    static table = "training_event";
    static associations = {
        training_module: {
            type: <const>"belongs_to",
            key: "training_module",
        },
        village: { type: <const>"belongs_to", key: "village" },
    };

    @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @date("scheduled_for") scheduledFor!: number;
    @field("scheduled_time") scheduledTime!: string;
    @nochange @date("completed_at") completedAt!: number;
    @nochange @field("location") location!: string;
    @text("comments") comments!: string;

    @immutableRelation("training_module", "training_module")
    trainingModule!: Relation<TrainingModule>;
    @immutableRelation("village", "village") village!: Relation<Village>;
}
