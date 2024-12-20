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
                { name: "module_id", type: "string" },
                { name: "scheduled_for", type: "number" },
                { name: "completed_at", type: "number", isOptional: true },
                { name: "location", type: "string", isOptional: true },
                { name: "comments", type: "string", isOptional: true },
            ],
        }),
        tableSchema({
            name: "training_module",
            columns: [
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
                { name: "name", type: "string" },
                // { name: "country_code", type: "string" },
                { name: "topic", type: "string" },
                { name: "start_date", type: "number" },
                { name: "end_date", type: "number" },
            ],
        }),
        // tableSchema({
        //     name: "participation",
        //     columns: [
        //         { name: "created_by", type: "string" },
        //         { name: "created_at", type: "number" },
        //         { name: "updated_at", type: "number" },
        //         { name: "training_event_id", type: "string" },
        //         { name: "client_code", type: "string" },
        //         { name: "tombola_tickets", type: "number", isOptional: true },
        //         { name: "pics_purchased", type: "number", isOptional: true },
        //         { name: "pics_received", type: "number", isOptional: true },
        //     ],
        // }),
        // tableSchema({
        //     name: "training_event_image",
        //     columns: [
        //         { name: "created_by", type: "string" },
        //         { name: "created_at", type: "number" },
        //         { name: "updated_at", type: "number" },
        //         { name: "synced_at", type: "number", isOptional: true },
        //         { name: "training_event_id", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "participant_list_image",
        //     columns: [
        //         { name: "created_by", type: "string" },
        //         { name: "created_at", type: "number" },
        //         { name: "updated_at", type: "number" },
        //         { name: "synced_at", type: "number", isOptional: true },
        //         { name: "training_event_id", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "client",
        //     columns: [
        //         { name: "created_by", type: "string" },
        //         { name: "created_at", type: "number" },
        //         { name: "updated_at", type: "number" },
        //         { name: "first_name", type: "string" },
        //         { name: "last_name", type: "string" },
        //         { name: "phone_1", type: "string", isOptional: true },
        //         { name: "phone_2", type: "string", isOptional: true },
        //         { name: "sex", type: "string", isOptional: true },
        //         { name: "age_group", type: "string", isOptional: true },
        //         { name: "client_code", type: "string", isOptional: true },
        //         { name: "is_leader", type: "boolean", isOptional: true },
        //     ],
        // }),
        // tableSchema({
        //     name: "village",
        //     columns: [
        //         { name: "code", type: "string" },
        //         { name: "name", type: "string" },
        //         { name: "zone_code", type: "string" },
        //         { name: "district_code", type: "string" },
        //         { name: "country_code", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "zone",
        //     columns: [
        //         { name: "code", type: "string" },
        //         { name: "name", type: "string" },
        //         { name: "district_code", type: "string" },
        //         { name: "country_code", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "district",
        //     columns: [
        //         { name: "code", type: "string" },
        //         { name: "name", type: "string" },
        //         { name: "country_code", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "country",
        //     columns: [
        //         { name: "code", type: "string" },
        //         { name: "name", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "trainer",
        //     columns: [
        //         { name: "first_name", type: "string" },
        //         { name: "last_name", type: "string" },
        //     ],
        // }),
        // tableSchema({
        //     name: "assignment",
        //     columns: [
        //         { name: "trainer_id", type: "string" },
        //         { name: "village_code", type: "string" },
        //         { name: "start_date", type: "number" },
        //         { name: "end_date", type: "number", isOptional: true },
        //     ],
        // }),
    ],
});
