import { Model, Query, Relation } from "@nozbe/watermelondb";
import {
    field,
    text,
    date,
    nochange,
    readonly,
    immutableRelation,
    children,
} from "@nozbe/watermelondb/decorators";
import Zone from "./Zone";
import District from "./District";
import Village from "./Village";
import TrainingModule from "./TrainingModule";

export default class Country extends Model {
    static table = "country";
    static associations = {
        training_module: { type: <const>"has_many", foreignKey: "country" },
        village: { type: <const>"has_many", foreignKey: "country" },
        zone: { type: <const>"has_many", foreignKey: "country" },
        district: { type: <const>"has_many", foreignKey: "country" },
    };

    @readonly @field("name") name!: string;

    @children("training_module") trainingModules!: Query<TrainingModule>;
    @children("village") villages!: Query<Village>;
    @children("zone") zones!: Query<Zone>;
    @children("district") districts!: Query<District>;
}
