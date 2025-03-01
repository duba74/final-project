import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import ParticipantList from "@/components/trainer-event-form/ParticipantList";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { trainingEventCollection } from "@/database/database";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const Participants = () => {
    const { trainingEventId } = useGlobalSearchParams<{
        trainingEventId: string;
    }>();
    const [isLoading, setIsLoading] = useState(true);
    const [trainingEvent, setTrainingEvent] = useState<TrainingEvent | null>(
        null
    );

    console.log("trainingEventId: " + trainingEventId);

    useEffect(() => {
        const fetchData = async () => {
            if (trainingEventId) {
                try {
                    const trainingEventRecord =
                        await trainingEventCollection.find(trainingEventId);

                    setTrainingEvent(trainingEventRecord);
                } catch (error) {
                    console.error(`Error fetching records from DB: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [trainingEventId]);

    if (isLoading) {
        return (
            <ThemedView>
                <ThemedText>Loading data...</ThemedText>
            </ThemedView>
        );
    } else if (!trainingEvent) {
        return (
            <ThemedView>
                <ThemedText>Training Event not found!</ThemedText>
            </ThemedView>
        );
    } else {
        return <ParticipantList trainingEvent={trainingEvent} />;
    }
};

export default Participants;
