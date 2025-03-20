import TrainingModulePicker from "@/components/operations-menu/TrainingModulePicker";
import VillageList from "@/components/village-list/VillageList";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { View } from "react-native";

const PlannerVillages = () => {
    const { currentModule } = useCurrentModule();
    const { session } = useSession();
    const [role, setRole] = useState<string>();

    useEffect(() => {
        if (session) {
            try {
                const user = JSON.parse(session).user;
                setRole(user.role);
            } catch (error) {
                console.error(`Failed to parse session: ${error}`);
            }
        }
    }, [session]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
            testID="planner-villages"
        >
            <TrainingModulePicker currentModule={currentModule} />
            <VillageList currentModule={currentModule} role={role} />
        </View>
    );
};

export default PlannerVillages;
