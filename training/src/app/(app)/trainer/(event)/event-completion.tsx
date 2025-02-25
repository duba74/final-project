import ThemedButton from "@/components/themed/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import { useLocalSearchParams } from "expo-router";

const EventCompletion = () => {
    const { trainingEventId } = useLocalSearchParams<{
        trainingEventId?: string;
    }>();

    const handleRecordCompletionTime = () => {
        console.log(new Date());
    };

    const handleRecordGpsCoordinates = () => {
        console.log("Get coords");
    };

    return (
        <ThemedView>
            <ThemedButton
                title="Record Completion Time"
                onPress={handleRecordCompletionTime}
            />
            <ThemedButton
                title="Record GPS Coordinates"
                onPress={handleRecordGpsCoordinates}
            />
        </ThemedView>
    );
};

export default EventCompletion;
