import { Model, Query } from "@nozbe/watermelondb";
import { field, children, nochange } from "@nozbe/watermelondb/decorators";
import Assignment from "./Assignment";

export default class Staff extends Model {
    static table = "staff";
    static associations = {
        assignment: { type: <const>"has_many", foreignKey: "staff" },
    };

    @nochange @field("country") country!: string;
    @nochange @field("first_name") firstName!: string;
    @nochange @field("last_name") lastName!: string;
    @nochange @field("role_id") roleId!: string;
    @nochange @field("role_name") roleName!: string;

    @children("assignment") assignments!: Query<Assignment>;
}
