import { Button, Text, View } from "react-native";
import database, { trainingEventCollection, trainingModuleCollection } from "../database/database";
import TrainingModule from "../database/model/TrainingModule";

export default function Index() {
    const addModule = async () => {
        await database.write(async () => {
            await trainingModuleCollection.create((m) => {
                m.name = "m1";
                m.topic = "Composting";
                m.startDate = new Date("2012-02-10T13:19:11+0000").getTime();
                m.endDate = new Date("2012-04-10T13:19:11+0000").getTime();
            });
        });

        const res = await trainingModuleCollection.query().fetch();
        console.log(res);
    };

    const addEvent = async () => {
        await database.write(async () => {
            await trainingEventCollection.create((e) => {
                e.
            })
        })
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button title="Create Module" onPress={addModule} />
            <Button title="Create Event" onPress={addModule} />
        </View>
    );
}
