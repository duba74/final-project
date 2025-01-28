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
import Village from "./Village";

export default class Participant extends Model {
    static table = "participant";
    static associations = {
        training_event: { type: <const>"belongs_to", key: "training_event" },
        client: { type: <const>"belongs_to", key: "client" },
        village: { type: <const>"belongs_to", key: "village" },
    };

    @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @text("first_name") firstName!: string;
    @text("last_name") lastName!: string;
    @field("sex") sex!: string;
    @field("age_group") ageGroup!: string;
    @field("phone_1") phone1!: string;
    @field("phone_2") phone2!: string;
    @field("is_leader") isLeader!: boolean;
    @field("tombola_tickets") tombolaTickets!: number;
    @field("pics_purchased") picsPurchased!: number;
    @field("pics_received") picsReceived!: number;

    @immutableRelation("training_event", "training_event")
    trainingEvent!: Relation<TrainingEvent>;
    @immutableRelation("client", "client") client!: Relation<Client>;
    @immutableRelation("village", "village") village!: Relation<Village>;
}
