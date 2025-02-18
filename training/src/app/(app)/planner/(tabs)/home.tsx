import TrainingModulePicker from "@/components/planner-event-form/TrainingModulePicker";
import VillageList from "@/components/village-list/VillageList";
import { logRecords } from "@/database/db-utils";
import secondarySync from "@/database/secondary-sync";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useSession } from "@/hooks/useSession";
import { Button, View } from "react-native";

const PlannerHome = () => {
    const { logout, session } = useSession();
    const { currentModule } = useCurrentModule();

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
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
            testID="planner-home"
        >
            <TrainingModulePicker currentModule={currentModule} />
            <VillageList currentModule={currentModule} />
        </View>
    );
};

export default PlannerHome;
