import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    immutableRelation,
    nochange,
} from "@nozbe/watermelondb/decorators";
import Village from "./Village";
import Staff from "./Staff";

export default class Assignment extends Model {
    static table = "assignment";
    static associations = {
        village: { type: <const>"belongs_to", key: "village" },
        staff: { type: <const>"belongs_to", key: "staff" },
    };

    @nochange @field("start_date") startDate!: number;
    @nochange @field("end_date") endDate!: number;

    @immutableRelation("staff", "staff") staff!: Relation<Staff>;
    @immutableRelation("village", "village") village!: Relation<Village>;
}
