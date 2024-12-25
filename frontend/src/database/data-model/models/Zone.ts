import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    immutableRelation,
    children,
} from "@nozbe/watermelondb/decorators";
import District from "./District";
import Country from "./Country";
import Village from "./Village";

export default class Zone extends Model {
    static table = "zone";
    static associations = {
        village: { type: <const>"has_many", foreignKey: "zone" },
        district: { type: <const>"belongs_to", key: "district" },
        country: { type: <const>"belongs_to", key: "country" },
    };

    @readonly @field("code") code!: string;
    @readonly @field("name") name!: string;

    @children("village") villages!: Query<Village>;

    @immutableRelation("district", "district") district!: Relation<District>;
    @immutableRelation("country", "country") country!: Relation<Country>;
}
