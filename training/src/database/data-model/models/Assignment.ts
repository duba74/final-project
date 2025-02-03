import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    readonly,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import Village from "./Village";
import Staff from "./Staff";

export default class Assignment extends Model {
    static table = "assignment";
    static associations = {
        village: { type: <const>"belongs_to", key: "village" },
        staff: { type: <const>"belongs_to", key: "staff" },
    };

    @readonly @field("start_date") startDate!: number;
    @readonly @field("end_date") endDate!: number;

    @immutableRelation("staff", "staff") staff!: Relation<Staff>;
    @immutableRelation("village", "village") village!: Relation<Village>;
}
