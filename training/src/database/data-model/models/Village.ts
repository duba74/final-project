import { Model, Query } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    children,
    writer,
} from "@nozbe/watermelondb/decorators";
import TrainingEvent from "./TrainingEvent";
import Participant from "./Participant";
import Client from "./Client";
import Assignment from "./Assignment";
import TrainingModule from "./TrainingModule";

export default class Village extends Model {
    static table = "village";
    static associations = {
        training_event: { type: <const>"has_many", foreignKey: "village" },
        client: { type: <const>"has_many", foreignKey: "village" },
        participant: { type: <const>"has_many", foreignKey: "village" },
        assignment: { type: <const>"has_many", foreignKey: "village" },
    };

    @readonly @field("name") name!: string;
    @readonly @field("is_active") isActive!: boolean;
    @readonly @field("zone_name") zoneName!: string;
    @readonly @field("zone_code") zoneCode!: string;
    @readonly @field("district_name") districtName!: string;
    @readonly @field("district_code") districtCode!: string;
    @readonly @field("country_name") countryName!: string;
    @readonly @field("country_code") countryCode!: string;
    @readonly @field("latitude") latitude!: number;
    @readonly @field("longitude") longitude!: number;

    @children("training_event") trainingEvents!: Query<TrainingEvent>;
    @children("client") clients!: Query<Client>;
    @children("participant") participants!: Query<Participant>;
    @children("assignment") assignments!: Query<Assignment>;

    // TrainingEvent writer, starting from village, passing the TrainingModule as argument
    @writer async addTrainingEvent(
        trainingModule: TrainingModule,
        scheduledFor: string | Date,
        scheduledTimeOfDay: string,
        createdBy: string
    ) {
        const newTrainingEvent = await this.collections
            .get<TrainingEvent>("training_event")
            .create((trainingEvent) => {
                trainingEvent.village.set(this);
                trainingEvent.trainingModule.set(trainingModule);
                trainingEvent.scheduledFor =
                    scheduledFor instanceof Date
                        ? scheduledFor.getTime()
                        : new Date(scheduledFor).getTime();
                trainingEvent.scheduledTime = scheduledTimeOfDay;
                trainingEvent.createdBy = createdBy;
            });

        return newTrainingEvent;
    }
}
