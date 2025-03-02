import { Model, Q, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    children,
    immutableRelation,
    writer,
    lazy,
} from "@nozbe/watermelondb/decorators";
import TrainingModule from "./TrainingModule";
import Village from "./Village";
import Participant from "./Participant";
import Assignment from "./Assignment";
import Staff from "./Staff";
import { format, formatISO } from "date-fns";
import Client from "./Client";

export default class TrainingEvent extends Model {
    static table = "training_event";
    static associations = {
        staff: { type: <const>"belongs_to", key: "created_by" },
        training_module: { type: <const>"belongs_to", key: "training_module" },
        village: { type: <const>"belongs_to", key: "village" },
        participant: { type: <const>"has_many", foreignKey: "training_event" },
    };

    // @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @date("scheduled_for") scheduledFor!: Date;
    @field("scheduled_time") scheduledTime!: string;
    @field("is_canceled") isCanceled!: boolean | null;

    // Allow change for development
    // @nochange @date("completed_at") completedAt!: number | null;
    @date("completed_at") completedAt!: number | null;

    @field("location") location!: string;
    @text("comments") comments!: string | null;

    @immutableRelation("staff", "created_by") createdBy!: Relation<Staff>;
    @immutableRelation("training_module", "training_module")
    trainingModule!: Relation<TrainingModule>;
    @immutableRelation("village", "village") village!: Relation<Village>;

    @children("participant") participants!: Query<Participant>;

    @lazy trainers = this.collections
        .get<Staff>("staff")
        .query(
            Q.where("role_id", "trainer"),
            Q.on("assignment", [
                Q.where("village", this.village.id),
                Q.where("start_date", Q.lte(this.scheduledFor.getTime())),
                Q.or(
                    Q.where("end_date", Q.eq(null)),
                    Q.where("end_date", Q.gte(this.scheduledFor.getTime()))
                ),
            ])
        );

    @lazy potentialParticipants = this.collections
        .get<Client>("client")
        .query(Q.where("village", this.village.id));

    // Should probably be irreversible, not toggle-able
    @writer async toggleCancelEvent() {
        await this.update((trainingEvent) => {
            trainingEvent.isCanceled = !trainingEvent.isCanceled ? true : false;
        });
    }

    // Not a real method, just for development, use a different method for actual event completion
    // For real method, don't allow cancel if already completed
    @writer async toggleCompleteEvent() {
        await this.update((trainingEvent) => {
            trainingEvent.completedAt = !trainingEvent.completedAt
                ? new Date().getTime()
                : null;
        });
    }

    @writer async registerCompletionTime(timestamp: number) {
        await this.update((trainingEvent) => {
            trainingEvent.completedAt = timestamp;
        });
    }

    @writer async registerLocation(location: string) {
        await this.update((trainingEvent) => {
            trainingEvent.location = location;
        });
    }

    @writer async appendToComments(commentText: string, username: string) {
        await this.update((trainingEvent) => {
            trainingEvent.comments = !trainingEvent.comments
                ? `${formatISO(new Date())} - ${username} - ${commentText}`
                : `${trainingEvent.comments}\n${formatISO(
                      new Date()
                  )} - ${username} - ${commentText}`;
        });
    }

    @writer async deleteEvent() {
        await this.markAsDeleted();
    }

    //   @writer async markAsSpam() {
    //     await this.update(comment => {
    //       comment.isSpam = true
    //     })
    //   }

    //       @writer async addComment(body, author) {
    //     const newComment = await this.collections.get('comments').create(comment => {
    //       comment.post.set(this)
    //       comment.author.set(author)
    //       comment.body = body
    //     })
    //     return newComment
    //   }
}
