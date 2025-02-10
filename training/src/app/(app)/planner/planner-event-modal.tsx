import PlannerEventForm from "@/components/planner-event-form/PlannerEventForm";
import { useLocalSearchParams } from "expo-router";

const EventFormModal = () => {
    const { village } = useLocalSearchParams<{ village: string }>();

    return <PlannerEventForm village={village} />;
};

export default EventFormModal;
