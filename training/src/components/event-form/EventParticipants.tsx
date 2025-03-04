import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedButton from "../themed/ThemedButton";
import ThemedView from "../themed/ThemedView";
import EventVillageDescription from "./EventVillageDescription";
import ParticipantList from "./ParticipantList";
import { withObservables } from "@nozbe/watermelondb/react";
import { Href, useRouter } from "expo-router";
import { trainingEventCollection } from "@/database/database";

type EventParticipantsProps = {
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const EventParticipants = ({
    trainingEventId,
    trainingEvent,
}: EventParticipantsProps) => {
    const router = useRouter();

    const handleAddParticipant = () => {
        router.navigate({
            pathname:
                "/(app)/trainer/(home)/[trainingEventId]/participant-modal",
            params: {
                trainingEventId: trainingEvent.id,
            },
        });
    };

    return (
        <ThemedView>
            <EventVillageDescription trainingEvent={trainingEvent} />
            <ThemedButton
                title="Add Participant"
                onPress={handleAddParticipant}
            />
            <ParticipantList trainingEvent={trainingEvent} />
        </ThemedView>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: EventParticipantsProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(EventParticipants);
