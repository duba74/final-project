import { useGlobalSearchParams } from "expo-router";
import EventParticipants from "@/components/event-details/EventParticipants";
import { ScrollView } from "react-native";

const ParticipantsPage = () => {
    const { trainingEventId } = useGlobalSearchParams<{
        trainingEventId: string;
    }>();

    return <EventParticipants trainingEventId={trainingEventId} />;
};

export default ParticipantsPage;
