import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { withObservables } from "@nozbe/watermelondb/react";
import { trainingEventCollection } from "@/database/database";
import ParticipantPicker from "./ParticipantPicker";

type ParticipantFormProps = {
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const ParticipantForm = ({
    trainingEventId,
    trainingEvent,
}: ParticipantFormProps) => {
    return (
        <ThemedView>
            <ThemedText>Select participant from the list</ThemedText>
            <ThemedText>[Client List Dropdown, fuzzy searchable]</ThemedText>
            <ParticipantPicker trainingEvent={trainingEvent} />
            <ThemedText>
                [Form inputs, filled in by selection from dropdown]
            </ThemedText>
        </ThemedView>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: ParticipantFormProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(ParticipantForm);
