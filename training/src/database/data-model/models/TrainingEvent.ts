import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    children,
    immutableRelation,
    writer,
} from "@nozbe/watermelondb/decorators";
import TrainingModule from "./TrainingModule";
import Village from "./Village";
import Participant from "./Participant";

export default class TrainingEvent extends Model {
    static table = "training_event";
    static associations = {
        training_module: { type: <const>"belongs_to", key: "training_module" },
        village: { type: <const>"belongs_to", key: "village" },
        participant: { type: <const>"has_many", foreignKey: "training_event" },
    };

    @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;
    @date("scheduled_for") scheduledFor!: number;
    @field("scheduled_time") scheduledTime!: string;
    @field("is_canceled") isCanceled!: boolean | null;
    // @nochange @date("completed_at") completedAt!: number | null;
    @date("completed_at") completedAt!: number | null;
    @nochange @field("location") location!: string;
    @text("comments") comments!: string | null;

    @immutableRelation("training_module", "training_module")
    trainingModule!: Relation<TrainingModule>;
    @immutableRelation("village", "village") village!: Relation<Village>;

    @children("participant") participants!: Query<Participant>;

    @writer async toggleCancelEvent() {
        await this.update((trainingEvent) => {
            trainingEvent.isCanceled = !trainingEvent.isCanceled ? true : false;
        });
    }

    @writer async toggleCompleteEvent() {
        await this.update((trainingEvent) => {
            trainingEvent.completedAt = !trainingEvent.completedAt
                ? new Date().getTime()
                : null;
        });
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
