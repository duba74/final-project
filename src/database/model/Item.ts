import { Collection, Model, RawRecord } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    writer,
} from "@nozbe/watermelondb/decorators";

export default class Item extends Model {
    static table = "items";

    @text("content") content!: string;
    @nochange @field("created_by") createdBy!: string;
    @readonly @date("created_at") createdAt!: number;
    @readonly @date("updated_at") updatedAt!: number;

    @writer async addItem(content: string, createdBy: string) {
        const newItem = await this.collections
            .get<Item>("items")
            .create((item) => {
                item.content = content;
                item.createdBy = createdBy;
            });
        return newItem;
    }
}
