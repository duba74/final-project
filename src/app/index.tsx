import { Text, View } from "react-native";
import database from "../database/database";

export default function Index() {
    const db = database;
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/index.tsx to edit this screen!</Text>
        </View>
    );
}
