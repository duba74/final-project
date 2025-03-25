import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedView from "../themed/ThemedView";
import { withObservables } from "@nozbe/watermelondb/react";
import Participant from "@/database/data-model/models/Participant";
import { FlatList } from "react-native";
import ParticipantListItem from "./ParticipantListItem";

type ParticipantListProps = {
    trainingEvent: TrainingEvent;
    participantList: Participant[];
};

const ParticipantList = ({
    trainingEvent,
    participantList,
}: ParticipantListProps) => {
    return (
        <FlatList
            data={participantList}
            renderItem={({ item }) => (
                <ParticipantListItem
                    participant={item}
                    trainingEvent={trainingEvent}
                />
            )}
        />
    );
};

const enhance = withObservables(
    ["trainingEvent"],
    ({ trainingEvent }: ParticipantListProps) => ({
        participantList: trainingEvent.participants,
    })
);

export default enhance(ParticipantList);
