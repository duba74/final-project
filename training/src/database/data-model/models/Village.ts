import { Model, Query } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    children,
    writer,
    nochange,
} from "@nozbe/watermelondb/decorators";
import TrainingEvent from "./TrainingEvent";
import Participant from "./Participant";
import Client from "./Client";
import Assignment from "./Assignment";
import TrainingModule from "./TrainingModule";
import Staff from "./Staff";

export default class Village extends Model {
    static table = "village";
    static associations = {
        training_event: { type: <const>"has_many", foreignKey: "village" },
        client: { type: <const>"has_many", foreignKey: "village" },
        participant: { type: <const>"has_many", foreignKey: "village" },
        assignment: { type: <const>"has_many", foreignKey: "village" },
    };

    @nochange @field("name") name!: string;
    @nochange @field("is_active") isActive!: boolean;
    @nochange @field("zone_name") zoneName!: string;
    @nochange @field("zone_code") zoneCode!: string;
    @nochange @field("district_name") districtName!: string;
    @nochange @field("district_code") districtCode!: string;
    @nochange @field("country_name") countryName!: string;
    @nochange @field("country_code") countryCode!: string;
    @nochange @field("latitude") latitude!: number | null;
    @nochange @field("longitude") longitude!: number | null;

    @children("training_event") trainingEvents!: Query<TrainingEvent>;
    @children("client") clients!: Query<Client>;
    @children("participant") participants!: Query<Participant>;
    @children("assignment") assignments!: Query<Assignment>;

    // TrainingEvent writer, starting from village, passing the TrainingModule as argument
    @writer async addTrainingEvent(
        trainingModule: TrainingModule,
        scheduledFor: string | Date,
        scheduledTimeOfDay: string,
        createdBy: Staff
    ) {
        const newTrainingEvent = await this.collections
            .get<TrainingEvent>("training_event")
            .create((trainingEvent) => {
                trainingEvent.village.set(this);
                trainingEvent.trainingModule.set(trainingModule);
                trainingEvent.createdBy.set(createdBy);
                trainingEvent.scheduledFor =
                    scheduledFor instanceof Date
                        ? scheduledFor
                        : new Date(scheduledFor);
                trainingEvent.scheduledTime = scheduledTimeOfDay;
            });

        return newTrainingEvent;
    }
}
