import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";

type ParticipantListProps = {
    trainingEvent: TrainingEvent;
};

const ParticipantList = ({ trainingEvent }: ParticipantListProps) => {
    return (
        <ThemedView>
            <ThemedText>Participant List for {trainingEvent.id}</ThemedText>
        </ThemedView>
    );
};

export default ParticipantList;
