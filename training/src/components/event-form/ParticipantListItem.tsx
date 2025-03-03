import Participant from "@/database/data-model/models/Participant";
import ThemedText from "../themed/ThemedText";
import { withObservables } from "@nozbe/watermelondb/react";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";

type ParticipantListItemProps = {
    participant: Participant;
    trainingEvent: TrainingEvent;
};

const ParticipantListItem = ({
    participant,
    trainingEvent,
}: ParticipantListItemProps) => {
    // Function to go to participant modal

    return (
        // TODO: Make this a pressable, links to the participant form prefilled with the data, passing the ID?
        <ThemedText>{`${participant.firstName} ${participant.lastName}`}</ThemedText>
    );
};

const enhance = withObservables(
    ["participant"],
    ({ participant }: ParticipantListItemProps) => ({
        participant,
    })
);

export default enhance(ParticipantListItem);
