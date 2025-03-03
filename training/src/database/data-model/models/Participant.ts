import { Model, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    immutableRelation,
} from "@nozbe/watermelondb/decorators";
import TrainingEvent from "./TrainingEvent";
import Client from "./Client";
import Staff from "./Staff";

export default class Participant extends Model {
    static table = "participant";
    static associations = {
        training_event: { type: <const>"belongs_to", key: "training_event" },
        client: { type: <const>"belongs_to", key: "client" },
    };

    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @text("first_name") firstName!: string;
    @text("last_name") lastName!: string | null;
    @field("sex") sex!: string | null;
    @field("age_group") ageGroup!: string | null;
    @field("phone_1") phone1!: string | null;
    @field("phone_2") phone2!: string | null;
    @field("is_leader") isLeader!: boolean;
    @field("tombola_tickets") tombolaTickets!: number | null;
    @field("pics_purchased") picsPurchased!: number | null;
    @field("pics_received") picsReceived!: number | null;

    @immutableRelation("staff", "created_by") createdBy!: Relation<Staff>;
    @immutableRelation("training_event", "training_event")
    trainingEvent!: Relation<TrainingEvent>;
    @immutableRelation("client", "client") client!: Relation<Client>;
}
