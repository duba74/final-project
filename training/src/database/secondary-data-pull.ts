import database from "./database";
import { Platform } from "react-native";
import { replaceClients, replaceVillages } from "./db-utils";
import URLS from "@/constants/Urls";

const secondaryDataPull = async (authToken: string) => {
    const host =
        Platform.OS === "web" ? URLS.backend.web : URLS.backend.android;

    console.log(`🍉 Attempting secondary data pull`);

    const url = `${host}/api/secondarydatapull/`;
    console.log(url);

    const headers = { Authorization: `Bearer ${authToken}` };
    const options = { method: "GET", headers: headers };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    // console.log(await response.text());
    const { village, client, training_module, staff, assignment } =
        await response.json();

    replaceVillages(village);
    replaceClients(client);

    console.log(`🍉 Secondary data pull succeeded`);
};

export default secondaryDataPull;
