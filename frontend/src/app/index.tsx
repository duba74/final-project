import { Button, Text, View } from "react-native";
import { addTrainingModule, logRecords } from "../database/db-utils";
import database, {
    trainingEventCollection,
    trainingModuleCollection,
} from "../database/database";
import mainSync from "../database/main-sync";
import secondarySync from "../database/secondary-sync";

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
            <Button title="Main sync" onPress={mainSync} />
            <Button title="Secondary sync" onPress={secondarySync} />
            <Button
                title="Show villages"
                onPress={() => {
                    logRecords("village");
                }}
            />
            <Button
                title="Show modules"
                onPress={() => {
                    logRecords("trainingModule");
                }}
            />
            <Button
                title="Show events"
                onPress={() => {
                    logRecords("trainingEvent");
                }}
            />
        </View>
    );
}
