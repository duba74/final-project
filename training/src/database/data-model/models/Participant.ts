import { Model, Q, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    immutableRelation,
    lazy,
    writer,
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
    @immutableRelation("client", "client") client!: Relation<Client> | null;

    @lazy clients = this.collections
        .get<Client>("client")
        .query(Q.where("id", this.client?.id));

    @writer async updateParticipant(
        firstName: string,
        lastName: string,
        sex: string | undefined,
        ageGroup: string | undefined,
        phone1: string,
        phone2: string,
        isLeader: boolean | undefined,
        tombolaTickets: string,
        picsPurchased: string,
        picsReceived: string
    ) {
        await this.update((participant) => {
            participant.firstName = firstName;
            participant.lastName = lastName !== "" ? lastName : null;
            participant.sex = sex ? sex : null;
            participant.ageGroup = ageGroup ? ageGroup : null;
            participant.phone1 = phone1 !== "" ? phone1 : null;
            participant.phone2 = phone2 !== "" ? phone2 : null;
            participant.isLeader = isLeader ? isLeader : false;
            participant.tombolaTickets =
                tombolaTickets !== "" ? parseInt(tombolaTickets) : null;
            participant.picsPurchased =
                picsPurchased !== "" ? parseInt(picsPurchased) : null;
            participant.picsReceived =
                picsReceived !== "" ? parseInt(picsReceived) : null;
        });

        return this;
    }

    @writer async deleteParticipant() {
        await this.markAsDeleted();
    }
}
