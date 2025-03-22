import TrainingModulePicker from "@/components/operations-menu/TrainingModulePicker";
import ThemedView from "@/components/themed/ThemedView";
import TrainingModuleIndicator from "@/components/training-module-indicator/TrainingModuleIndicator";
import VillageList from "@/components/village-list/VillageList";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const TrainerVillages = () => {
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
        <ThemedView style={styles.container} testID="trainer-villages">
            <TrainingModuleIndicator trainingModuleId={currentModule} />
            <VillageList currentModule={currentModule} role={role} />
        </ThemedView>
    );
};

export default TrainerVillages;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
