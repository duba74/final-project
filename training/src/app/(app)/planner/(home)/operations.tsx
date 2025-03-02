import TrainingModulePicker from "@/components/event-form/TrainingModulePicker";
import VillageList from "@/components/village-list/VillageList";
import { logRecords } from "@/database/db-utils";
import sync from "@/database/sync";
import secondaryDataPull from "@/database/secondary-data-pull";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useSession } from "@/hooks/useSession";
import { Button, View } from "react-native";

const PlannerOperations = () => {
    const { logout, session } = useSession();
    const { currentModule } = useCurrentModule();

    const handleSync = () => {
        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                const token = parsedSession.token;

                sync(token);
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
        } else {
            console.error("No session available");
        }
    };

    const handleSecondaryDataPull = () => {
        if (session) {
            try {
                const parsedSession = JSON.parse(session);
                const token = parsedSession.token;

                secondaryDataPull(token);
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
        } else {
            console.error("No session available");
        }
    };

    return (
        <View
            style={{
                flex: 1,
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
            }}
            testID="planner-home"
        >
            <Button title="Logout" onPress={logout} />
            <Button title="Sync" onPress={handleSync} />
            <Button
                title="Secondary Data Pull"
                onPress={handleSecondaryDataPull}
            />
            <Button
                title="Log Villages"
                onPress={() => logRecords("village")}
            />
            <Button
                title="Log Training Modules"
                onPress={() => logRecords("trainingModule")}
            />
            <Button
                title="Log Current Training Module"
                onPress={() => console.log(currentModule)}
            />
            <Button title="Log Clients" onPress={() => logRecords("client")} />
            <Button
                title="Log Training Events"
                onPress={() => logRecords("trainingEvent")}
            />
            <Button
                title="Log Assignments"
                onPress={() => logRecords("assignment")}
            />
        </View>
    );
};

export default PlannerOperations;
