import ParticipantForm from "@/components/event-form/ParticipantForm";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView } from "react-native";

const ParticipantModal = () => {
    const { trainingEventId } = useLocalSearchParams<{
        trainingEventId: string;
    }>();

    return (
        <ThemedView style={{ flex: 1 }}>
            <ThemedText>Add participant modal</ThemedText>
            <ThemedText>{trainingEventId}</ThemedText>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ParticipantForm trainingEventId={trainingEventId} />
            </ScrollView>
        </ThemedView>
    );
};

export default ParticipantModal;
