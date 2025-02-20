import TrainingModulePicker from "@/components/planner-event-form/TrainingModulePicker";
import VillageList from "@/components/village-list/VillageList";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { useSession } from "@/hooks/useSession";
import { View } from "react-native";

const PlannerHome = () => {
    const { currentModule } = useCurrentModule();

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
