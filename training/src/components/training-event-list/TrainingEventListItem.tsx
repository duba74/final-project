import { withObservables } from "@nozbe/watermelondb/react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useRouter } from "expo-router";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format } from "date-fns";

type TrainingEventListItemProps = {
    trainingEvent: TrainingEvent;
};

const TrainingEventListItem = ({
    trainingEvent,
}: TrainingEventListItemProps) => {
    return (
        <ThemedView
            style={{ flexDirection: "row", gap: 15, marginVertical: 10 }}
        >
            <ThemedText>
                {format(trainingEvent.scheduledFor, "PPPP")}
            </ThemedText>
            <ThemedText>{trainingEvent.scheduledTime}</ThemedText>
            <ThemedText>{trainingEvent.createdBy}</ThemedText>
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

const styles = StyleSheet.create({});
