import { Button, Text, View } from "react-native";
import { addTrainingModule, logRecords } from "../database/db-utils";
import database, {
    trainingEventCollection,
    trainingModuleCollection,
} from "../database/database";
import sync from "../database/main-sync";

export default function Index() {
    const createTrainingEvent = async (date: string | Date = new Date()) => {
        const trainingModules = await trainingModuleCollection.query().fetch();
        const trainingModule = trainingModules.at(1);
        if (trainingModule) {
            const newTrainingEvent = await trainingModule.addTrainingEvent(
                date
            );
            console.log(newTrainingEvent);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button title="Sync" onPress={sync} />
            <Button
                title="Show stuff"
                onPress={() => {
                    logRecords("village");
                }}
            />
        </View>
    );
}
