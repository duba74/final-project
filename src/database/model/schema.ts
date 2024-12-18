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
                { name: "participant_id", type: "string" },
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
        // Split these up into separate schema files and merge in this one?
        // Participants that aren't clients
        // Clients
        // Villages
        // Zones
        // Districts
        // Countries
        // Staff
    ],
});
