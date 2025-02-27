import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import EventCompletionForm from "@/components/trainer-event-form/EventCompletionForm";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { trainingEventCollection } from "@/database/database";
import { useSession } from "@/hooks/useSession";
import { withObservables } from "@nozbe/watermelondb/react";
import { parse } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const EventCompletion = () => {
    const { session } = useSession();
    const { trainingEventId } = useLocalSearchParams<{
        trainingEventId: string;
    }>();
    const [isLoading, setIsLoading] = useState(true);
    TrainingEvent;
    const [trainingEvent, setTrainingEvent] = useState<TrainingEvent | null>(
        null
    );
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trainingEventRecord = await trainingEventCollection.find(
                    trainingEventId
                );

                setTrainingEvent(trainingEventRecord);
            } catch (error) {
                console.error(`Error fetching records from DB: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };

        const parseUser = () => {
            if (!session) {
                console.log("No session");
                setUsername("");
            } else {
                const user = JSON.parse(session).user;
                console.log(user);
                setUsername(user.username);
            }
        };

        fetchData();
        parseUser();
    }, [trainingEventId, session]);

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
        return (
            <EventCompletionForm
                username={username}
                trainingEvent={trainingEvent}
            />
        );
    }
};

export default EventCompletion;
