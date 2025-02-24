import { Model, Query } from "@nozbe/watermelondb";
import {
    text,
    date,
    readonly,
    children,
    writer,
    nochange,
} from "@nozbe/watermelondb/decorators";
import TrainingEvent from "./TrainingEvent";

export default class TrainingModule extends Model {
    static table = "training_module";
    static associations = {
        training_event: {
            type: <const>"has_many",
            foreignKey: "training_module",
        },
    };

    @nochange @text("name") name!: string;
    @nochange @text("topic") topic!: string;
    @nochange @text("country") country!: string;
    @nochange @date("start_date") startDate!: number;
    @nochange @date("end_date") endDate!: number;
    @nochange @date("is_active") isActive!: boolean;

    @children("training_event") trainingEvents!: Query<TrainingEvent>;

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
