import { Model, Relation, Query } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    children,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import Village from "./Village";
import Zone from "./Zone";
import Country from "./Country";

export default class District extends Model {
    static table = "district";
    static associations = {
        village: { type: <const>"has_many", foreignKey: "country" },
        zone: { type: <const>"has_many", foreignKey: "country" },
        country: { type: <const>"belongs_to", key: "country" },
    };

    @readonly @field("name") name!: string;

    @children("village") villages!: Query<Village>;
    @children("zone") zones!: Query<Zone>;

    @immutableRelation("country", "country") country!: Relation<Country>;
}
