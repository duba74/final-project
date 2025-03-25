import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import ThemedButton from "../themed/ThemedButton";
import ThemedView from "../themed/ThemedView";
import EventDescription from "./EventDescription";
import ParticipantList from "./ParticipantList";
import { withObservables } from "@nozbe/watermelondb/react";
import { Href, useRouter } from "expo-router";
import { trainingEventCollection } from "@/database/database";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

type EventParticipantsProps = {
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const EventParticipants = ({
    trainingEventId,
    trainingEvent,
}: EventParticipantsProps) => {
    const { t } = useTranslation();
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
        <View style={styles.container}>
            <EventDescription trainingEvent={trainingEvent} />
            <ThemedButton
                style={styles.button}
                title={t("participantList.addParticipantButtonTitle")}
                onPress={handleAddParticipant}
            />
            <ParticipantList
                style={{ flex: 1 }}
                trainingEvent={trainingEvent}
            />
        </View>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: EventParticipantsProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(EventParticipants);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    button: {
        alignSelf: "center",
        width: 300,
    },
});
