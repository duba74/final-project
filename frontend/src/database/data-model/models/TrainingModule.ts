import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    text,
    date,
    readonly,
    children,
    writer,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import TrainingEvent from "./TrainingEvent";
import Country from "./Country";

export default class TrainingModule extends Model {
    static table = "training_module";
    static associations = {
        training_event: {
            type: <const>"has_many",
            foreignKey: "training_module_id",
        },
    };

    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @text("name") name!: string;
    @text("topic") topic!: string;
    @readonly @date("start_date") startDate!: number;
    @readonly @date("end_date") endDate!: number;

    @immutableRelation("country", "country") country!: Relation<Country>;

    @children("training_event") trainingEvents!: Query<TrainingEvent>;

    @writer async addTrainingEvent(scheduledFor: string | Date = "2024-12-01") {
        const newTrainingEvent = await this.collections
            .get<TrainingEvent>("training_event")
            .create((trainingEvent) => {
                trainingEvent.trainingModule.set(this);
                trainingEvent.scheduledFor =
                    scheduledFor instanceof Date
                        ? scheduledFor.getTime()
                        : new Date(scheduledFor).getTime();
            });

        return newTrainingEvent;
    }
}
