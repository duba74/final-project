import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    immutableRelation,
    children,
} from "@nozbe/watermelondb/decorators";
// import TrainingEvent from "./TrainingEvent";

export default class Village extends Model {
    static table = "village";
    static associations = {
        // training_event: { type: <const>"has_many", foreignKey: "village" },
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

    // @children("training_event") trainingEvents!: Query<TrainingEvent>;
}
