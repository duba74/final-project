import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "training_event",
            columns: [
                { name: "created_by", type: "string" },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "scheduled_for", type: "number" },
                { name: "completed_at", type: "number" },
                { name: "location", type: "string" },
                { name: "comments", type: "string" },
            ],
        }),
        tableSchema({
            name: "participation",
            columns: [
                { name: "created_by", type: "string" },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "training_event_id", type: "string" },
                { name: "client_id", type: "string" },
            ],
        }),
        tableSchema({
            name: "training_event_image",
            columns: [
                { name: "created_by", type: "string" },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "synced_at", type: "number" },
                { name: "training_event_id", type: "string" },
            ],
        }),
        tableSchema({
            name: "participant_list_image",
            columns: [
                { name: "created_by", type: "string" },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "synced_at", type: "number" },
                { name: "training_event_id", type: "string" },
            ],
        }),
        tableSchema({
            name: "client",
            columns: [
                { name: "created_by", type: "string" },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "first_name", type: "string" },
                { name: "last_name", type: "string" },
                { name: "phone_1", type: "string" },
                { name: "phone_2", type: "string" },
                { name: "sex", type: "string" },
                { name: "age_group", type: "string" },
                { name: "client_code", type: "string" },
                { name: "is_leader", type: "boolean" },
            ],
        }),
        tableSchema({
            name: "village",
            columns: [
                { name: "village_code", type: "string" },
                { name: "village_name", type: "string" },
                { name: "zone_code", type: "string" },
                { name: "district_code", type: "string" },
                { name: "country_code", type: "string" },
            ],
        }),
        tableSchema({
            name: "zone",
            columns: [
                { name: "zone_code", type: "string" },
                { name: "zone_name", type: "string" },
                { name: "district_code", type: "string" },
                { name: "country_code", type: "string" },
            ],
        }),
        tableSchema({
            name: "district",
            columns: [
                { name: "district_code", type: "string" },
                { name: "district_name", type: "string" },
                { name: "country_code", type: "string" },
            ],
        }),
        tableSchema({
            name: "country",
            columns: [
                { name: "country_code", type: "string" },
                { name: "country_name", type: "string" },
            ],
        }),
        // Staff
    ],
});
