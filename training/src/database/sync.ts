import { synchronize } from "@nozbe/watermelondb/sync";
import database from "./database";
import { Platform } from "react-native";
import URLS from "@/constants/Urls";

const sync = async (authToken: string) => {
    const host =
        Platform.OS === "web" ? URLS.backend.web : URLS.backend.android;

    await synchronize({
        database,
        pullChanges: async ({
            lastPulledAt /*, schemaVersion, migration*/,
        }) => {
            console.log(
                `🍉 Main sync - Attempting pull with lastPulledAt = ${lastPulledAt}`
            );

            const urlParams = `lastPulledAt=${lastPulledAt}`;
            // const urlParams = `lastPulledAt=null`;
            // const urlParams = `lastPulledAt=${lastPulledAt}&schemaVersion=${schemaVersion}&migration=${migration}`;
            const url = `${host}/api/sync/?${urlParams}`;

            console.log(url);

            const headers = { Authorization: `Bearer ${authToken}` };
            const options = { method: "GET", headers: headers };

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const { changes, timestamp } = await response.json();

            console.log(`🍉 Pull succeeded at timestamp = ${timestamp}`);

            return { changes, timestamp };
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
            console.log(
                `🍉 Attempting push with lastPulledAt = ${lastPulledAt}`
            );

            const urlParams = `lastPulledAt=${lastPulledAt}`;
            const url = `${host}/api/sync/?${urlParams}`;

            const payload = JSON.stringify({
                changes,
                lastPulledAt,
            });

            const headers = {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            };
            const options = { method: "POST", headers: headers, body: payload };

            console.log("payload");
            console.log(payload);

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(await response.text());
            }

            console.log(`🍉 Push successful`);
        },
    });
};

export default sync;
