import database from "./database";
import { Platform } from "react-native";
import {
    replaceAssignments,
    replaceClients,
    replaceStaff,
    replaceTrainingModules,
    replaceVillages,
} from "./db-utils";
import URLS from "@/constants/Urls";

const secondaryDataPull = async (authToken: string) => {
    const host =
        Platform.OS === "web" ? URLS.backend.web : URLS.backend.android;

    console.log(`🍉 Attempting secondary data pull`);

    const url = `${host}/api/secondarydatapull/`;

    const headers = { Authorization: `Bearer ${authToken}` };
    const options = { method: "GET", headers: headers };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const { villages, clients, training_modules, staff, assignments } =
        await response.json();

    await replaceVillages(villages);
    await replaceClients(clients);
    await replaceTrainingModules(training_modules);
    await replaceStaff(staff);
    await replaceAssignments(assignments);

    console.log(`🍉 Secondary data pull succeeded`);
};

export default secondaryDataPull;
