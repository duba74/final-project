import ParticipantForm from "@/components/event-form/ParticipantForm";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { useGlobalSearchParams } from "expo-router";

const ParticipantModal = () => {
    const { trainingEventId } = useGlobalSearchParams<{
        trainingEventId: string;
    }>();

    return (
        <ThemedView>
            <ThemedText>Add participant modal</ThemedText>
            <ThemedText>{trainingEventId}</ThemedText>
            <ParticipantForm trainingEventId={trainingEventId} />
        </ThemedView>
    );
};

export default ParticipantModal;
