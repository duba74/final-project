import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import { trainingEventCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import EventVillageDescription from "./EventVillageDescription";
import ThemedButton from "../themed/ThemedButton";
import { useRouter } from "expo-router";

type ParticipantListProps = {
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const ParticipantList = ({
    trainingEventId,
    trainingEvent,
}: ParticipantListProps) => {
    const router = useRouter();

    return (
        <ThemedView>
            <ThemedText>Participant List for {trainingEvent.id}</ThemedText>
        </ThemedView>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: ParticipantListProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(ParticipantList);
