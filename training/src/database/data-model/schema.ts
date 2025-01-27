import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "training_event",
            columns: [
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "created_by", type: "string" },
                { name: "scheduled_for", type: "number" },
                { name: "scheduled_time", type: "string" },
                { name: "is_canceled", type: "boolean" },
                { name: "village", type: "string" },
                { name: "completed_at", type: "number" },
                { name: "location", type: "string" },
                { name: "comments", type: "string" },
                { name: "training_module", type: "string" },
            ],
        }),
        tableSchema({
            name: "village",
            columns: [
                { name: "name", type: "string" },
                { name: "zone_code", type: "string" },
                { name: "zone_name", type: "string" },
                { name: "district_code", type: "string" },
                { name: "district_name", type: "string" },
                { name: "country_code", type: "string" },
                { name: "country_name", type: "string" },
                { name: "latitude", type: "number" },
                { name: "longitude", type: "number" },
                { name: "is_active", type: "boolean" },
            ],
        }),
        tableSchema({
            name: "client",
            columns: [
                { name: "first_name", type: "string" },
                { name: "last_name", type: "string" },
                { name: "sex", type: "string" },
                { name: "age_group", type: "string" },
                { name: "phone_1", type: "string" },
                { name: "phone_2", type: "string" },
                { name: "is_leader", type: "boolean" },
                { name: "village", type: "string" },
            ],
        }),
        tableSchema({
            name: "training_module",
            columns: [
                { name: "name", type: "string" },
                { name: "topic", type: "string" },
                { name: "country", type: "string" },
                { name: "start_date", type: "number" },
                { name: "end_date", type: "number" },
                { name: "is_active", type: "boolean" },
            ],
        }),
    ],
});
