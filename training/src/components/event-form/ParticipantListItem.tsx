import Participant from "@/database/data-model/models/Participant";
import ThemedText from "../themed/ThemedText";
import { withObservables } from "@nozbe/watermelondb/react";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import Client from "@/database/data-model/models/Client";
import { Pressable, View } from "react-native";
import { Href, useRouter } from "expo-router";

type ParticipantListItemProps = {
    participant: Participant;
    trainingEvent: TrainingEvent;
    clients: Client[];
};

const ParticipantListItem = ({
    participant,
    trainingEvent,
    clients,
}: ParticipantListItemProps) => {
    // Function to go to participant modal
    const client = clients.length > 0 ? clients[0] : null;
    const router = useRouter();

    const handleEditParticipant = () => {
        router.navigate({
            pathname:
                "/(app)/trainer/(home)/[trainingEventId]/participant-modal",
            params: {
                trainingEventId: trainingEvent.id,
                participantId: participant.id,
            },
        });
    };

    return (
        // TODO: Make this a pressable, links to the participant form prefilled with the data, passing the ID?
        <View
            style={{
                margin: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#aaa",
            }}
        >
            <Pressable onPress={handleEditParticipant}>
                <ThemedText>{`${participant.firstName} ${participant.lastName}`}</ThemedText>
                {client && <ThemedText>{client.id}</ThemedText>}
            </Pressable>
        </View>
    );
};

const enhance = withObservables(
    ["participant"],
    ({ participant }: ParticipantListItemProps) => ({
        participant,
        clients: participant.clients.observe(),
    })
);

export default enhance(ParticipantListItem);
