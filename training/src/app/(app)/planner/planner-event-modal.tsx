import PlannerEventForm from "@/components/planner-event-form/PlannerEventForm";
import { useLocalSearchParams } from "expo-router";

const EventFormModal = () => {
    const { village, currentModule } = useLocalSearchParams<{
        village: string;
        currentModule: string;
    }>();

    return <PlannerEventForm village={village} currentModule={currentModule} />;
};

export default EventFormModal;
