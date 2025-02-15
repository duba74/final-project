import { withObservables } from "@nozbe/watermelondb/react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useRouter } from "expo-router";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format } from "date-fns";
import database from "@/database/database";

type TrainingEventListItemProps = {
    trainingEvent: TrainingEvent;
};

const TrainingEventListItem = ({
    trainingEvent,
}: TrainingEventListItemProps) => {
    const toggleCancelEvent = async () => {
        await trainingEvent.toggleCancelEvent();
    };

    const toggleCompleteEvent = async () => {
        await trainingEvent.toggleCompleteEvent();
    };

    return (
        <ThemedView>
            <ThemedView
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 15,
                    marginVertical: 10,
                }}
            >
                <ThemedText>
                    {format(trainingEvent.scheduledFor, "PPPP")}
                </ThemedText>
                <ThemedText>{trainingEvent.scheduledTime}</ThemedText>
                <ThemedText>{trainingEvent.createdBy}</ThemedText>
                {trainingEvent.isCanceled && <ThemedText>Canceled!</ThemedText>}
                {trainingEvent.completedAt && (
                    <ThemedText>
                        Completed on{" "}
                        {format(trainingEvent.completedAt, "PPPPp")}
                    </ThemedText>
                )}
            </ThemedView>
            <Pressable onPress={toggleCancelEvent}>
                <ThemedText>Cancel event</ThemedText>
            </Pressable>
            <Pressable onPress={toggleCompleteEvent}>
                <ThemedText>Toggle completion</ThemedText>
            </Pressable>
            <View style={styles.separator} />
        </ThemedView>
    );
};

const enhance = withObservables(
    ["trainingEvent"],
    ({ trainingEvent }: TrainingEventListItemProps) => ({
        trainingEvent,
    })
);

export default enhance(TrainingEventListItem);

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: "#aaa",
        marginVertical: 10,
    },
});
