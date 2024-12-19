import { Model } from "@nozbe/watermelondb";
import { text, date, readonly, children } from "@nozbe/watermelondb/decorators";
import TrainingEvent from "./TrainingEvent";

export default class Module extends Model {
    static table = "module";
    static associations = {
        training_event: { type: <const>"has_many", foreignKey: "module_id" },
    };

    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @text("name") name!: string;
    @text("topic") topic!: string;
    @readonly @date("start_date") startDate!: number;
    @readonly @date("end_date") endDate!: number;
    @children("training_event") trainingEvents!: TrainingEvent[];
}
