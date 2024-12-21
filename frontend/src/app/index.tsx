import { Button, Text, View } from "react-native";
import { addTrainingModule, logRecords } from "../database/model/db-utils";
import database, {
    trainingEventCollection,
    trainingModuleCollection,
} from "../database/database";

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
            <Button
                title="Create training module"
                onPress={() => addTrainingModule()}
            />
            <Button
                title="Show training modules"
                onPress={() => logRecords("trainingModule")}
            />
            <Button
                title="Create training event"
                onPress={() => createTrainingEvent()}
            />
            <Button
                title="Show training events"
                onPress={() => logRecords("trainingEvent")}
            />
            <Button
                title="Show events for one module"
                onPress={async () => {
                    const trainingModules = await trainingModuleCollection
                        .query()
                        .fetch();
                    const trainingModule = trainingModules.at(1);
                    const trainingModuleEvents =
                        await trainingModule?.trainingEvents;
                    // console.log(JSON.stringify(trainingModuleEvents, null, 4));
                    console.log(trainingModuleEvents);
                }}
            />
            <Button
                title="Show module for one event"
                onPress={async () => {
                    const trainingEvents = await trainingEventCollection
                        .query()
                        .fetch();
                    const trainingEvent = trainingEvents.at(0);
                    const trainingModuleId = trainingEvent?.trainingModule.id;
                    const trainingModule = await trainingModuleCollection.find(
                        trainingModuleId
                    );
                    console.log(trainingModule);
                }}
            />
        </View>
    );
}
