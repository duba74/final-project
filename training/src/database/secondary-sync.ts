import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./database";
import { Platform } from "react-native";
import { deleteAllRecordsFromTable } from "./db-utils";
import URLS from "@/constants/Urls";

const secondarySync = async (authToken: string) => {
    const host =
        Platform.OS === "web" ? URLS.backend.web : URLS.backend.android;

    await synchronize({
        database,
        pullChanges: async ({
            lastPulledAt /*, schemaVersion, migration*/,
        }) => {
            console.log(
                `🍉 Secondary sync - Attempting pull with lastPulledAt = ${lastPulledAt}`
            );

            const urlParams = `lastPulledAt=${lastPulledAt}`;
            // const urlParams = `lastPulledAt=${lastPulledAt}&schemaVersion=${schemaVersion}&migration=${migration}`;
            const url = `${host}/api/secondarysync/?${urlParams}`;
            console.log(url);

            const headers = { Authorization: `Bearer ${authToken}` };
            const options = { method: "GET", headers: headers };

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(await response.text());
            }

            // console.log(await response.text());
            const { changes, timestamp } = await response.json();

            const tables = [
                "village",
                "client",
                "training_module",
                "assignment",
                "staff",
            ];

            tables.forEach(async (table) => {
                await deleteAllRecordsFromTable(table);
                console.log(`deleted ${table}`);
            });

            console.log(`🍉 Pull succeeded at timestamp = ${timestamp}`);
            console.log(typeof timestamp);
            console.log(`🍉 Pull succeeded with changes:`);
            // console.log(changes);

            return { changes, timestamp };
        },
        sendCreatedAsUpdated: true,
    });
};

export default secondarySync;
