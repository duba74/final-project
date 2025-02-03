import { Model, Query } from "@nozbe/watermelondb";
import { field, readonly, children } from "@nozbe/watermelondb/decorators";
import Assignment from "./Assignment";

export default class Staff extends Model {
    static table = "staff";
    static associations = {
        assignment: { type: <const>"has_many", foreignKey: "staff" },
    };

    @readonly @field("country") country!: string;
    @readonly @field("first_name") firstName!: string;
    @readonly @field("last_name") lastName!: string;
    @readonly @field("role_id") roleId!: string;
    @readonly @field("role_name") roleName!: string;

    @children("assignment") assignments!: Query<Assignment>;
}
