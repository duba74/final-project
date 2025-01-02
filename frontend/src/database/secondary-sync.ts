import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./database";
import { Platform } from "react-native";

const secondarySync = async () => {
    const host =
        Platform.OS === "web"
            ? "http://127.0.0.1:8000"
            : "https://d2e1-197-234-221-131.ngrok-free.app";

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
            const url = `${host}/api/secondary-sync/?${urlParams}`;
            console.log(url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(await response.text());
            }

            console.log(await response.text());
            const { changes, timestamp } = await response.json();

            console.log(`🍉 Pull succeeded at timestamp = ${timestamp}`);
            console.log(`🍉 Pull succeeded with changes:`);
            console.log(changes);

            return { changes, timestamp };
        },
        sendCreatedAsUpdated: true,
    });
};

export default secondarySync;
