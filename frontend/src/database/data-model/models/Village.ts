import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    immutableRelation,
    children,
} from "@nozbe/watermelondb/decorators";
import Zone from "./Zone";
import District from "./District";
import Country from "./Country";
import TrainingEvent from "./TrainingEvent";

export default class Village extends Model {
    static table = "village";
    static associations = {
        training_event: { type: <const>"has_many", foreignKey: "village" },
        // zone: { type: <const>"belongs_to", key: "zone" },
        // district: { type: <const>"belongs_to", key: "district" },
        // country: { type: <const>"belongs_to", key: "country" },
    };

    @readonly @field("code") code!: string;
    @readonly @field("name") name!: string;
    @readonly @field("zone_name") zoneName!: string;
    @readonly @field("zone_code") zoneCode!: string;
    @readonly @field("district_name") districtName!: string;
    @readonly @field("country_name") countryName!: string;
    @readonly @field("country_code") countryCode!: string;

    @children("training_event") trainingEvents!: Query<TrainingEvent>;

    // @immutableRelation("zone", "zone") zone!: Relation<Zone>;
    // @immutableRelation("district", "district") district!: Relation<District>;
    // @immutableRelation("country", "country") country!: Relation<Country>;
}
