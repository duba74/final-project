import ParticipantForm from "@/components/event-details/ParticipantForm";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

const ParticipantModal = () => {
    const { trainingEventId, participantId } = useLocalSearchParams<{
        trainingEventId: string;
        participantId?: string;
    }>();

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <ParticipantForm
                    trainingEventId={trainingEventId}
                    participantId={participantId}
                />
            </ScrollView>
        </View>
    );
};

export default ParticipantModal;
