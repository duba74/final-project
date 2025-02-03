import VillageList from "@/components/village-list/VillageList";
import { logRecords } from "@/database/db-utils";
import secondarySync from "@/database/secondary-sync";
import { useSession } from "@/hooks/useSession";
import { Button, View } from "react-native";

const PlannerHome = () => {
    const { logout, session } = useSession();

    const handleSecondarySync = () => {
        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                const token = parsedSession.token;

                secondarySync(token);
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
        } else {
            console.error("No session available");
        }
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            testID="planner-home"
        >
            <Button title="Logout" onPress={logout} />
            <Button title="Secondary Sync" onPress={handleSecondarySync} />
            <Button
                title="Log Villages"
                onPress={() => logRecords("village")}
            />
            <Button
                title="Log Training Modules"
                onPress={() => logRecords("trainingModule")}
            />
            <Button title="Log Clients" onPress={() => logRecords("client")} />

            <VillageList />
        </View>
    );
};

export default PlannerHome;
