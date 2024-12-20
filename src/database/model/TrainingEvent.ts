import { Model } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import TrainingModule from "./TrainingModule";

export default class TrainingEvent extends Model {
    static table = "training_event";
    static associations: {
        module: { type: "belongs_to"; key: "module_id" };
    };

    @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @date("scheduled_for") scheduledFor!: number;
    @nochange @date("completed_at") completedAt!: number;
    @nochange @field("location") location!: string;
    @text("comments") comments!: string;

    @immutableRelation("training_module", "module_id") module!: TrainingModule;
}
