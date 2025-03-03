import { useGlobalSearchParams } from "expo-router";
import EventParticipants from "@/components/event-form/EventParticipants";

const ParticipantsPage = () => {
    const { trainingEventId } = useGlobalSearchParams<{
        trainingEventId: string;
    }>();

    return <EventParticipants trainingEventId={trainingEventId} />;
};

export default ParticipantsPage;
