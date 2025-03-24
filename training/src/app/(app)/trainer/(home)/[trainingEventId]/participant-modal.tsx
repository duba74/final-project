import ParticipantForm from "@/components/event-form/ParticipantForm";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

const ParticipantModal = () => {
    const { trainingEventId, participantId } = useLocalSearchParams<{
        trainingEventId: string;
        participantId?: string;
    }>();

    return (
        <ThemedView style={{ flex: 1 }}>
            <ThemedText>Add participant modal</ThemedText>
            <ThemedText>{trainingEventId}</ThemedText>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ParticipantForm
                    trainingEventId={trainingEventId}
                    participantId={participantId}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default ParticipantModal;
