import { compose, withObservables } from "@nozbe/watermelondb/react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useRouter } from "expo-router";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format } from "date-fns";
import Village from "@/database/data-model/models/Village";
import { Q, Query } from "@nozbe/watermelondb";
import Assignment from "@/database/data-model/models/Assignment";
import { assignmentCollection } from "@/database/database";

type TrainingEventListItemProps = {
    trainingEvent: TrainingEvent;
    village: Village;
    trainers: Assignment[];
};

const TrainingEventListItem = ({
    trainingEvent,
    village,
    trainers,
}: TrainingEventListItemProps) => {
    const router = useRouter();

    const handleModifyEvent = async () => {
        router.navigate({
            pathname: "./planner-event-modal",
            params: { trainingEventId: trainingEvent.id },
        });
    };

    console.log(trainers);

    return (
        <ThemedView>
            <Pressable onPress={handleModifyEvent}>
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
                    <ThemedText>{village.id}</ThemedText>
                    {trainers.map((t, i) => {
                        return (
                            <ThemedText key={i}>{`${t.staff.id}, ${format(
                                t.startDate,
                                "PP"
                            )}, ${format(t.endDate, "PP")}`}</ThemedText>
                        );
                    })}
                    <ThemedText>{trainingEvent.createdBy}</ThemedText>
                    {trainingEvent.isCanceled && (
                        <ThemedText>Canceled!</ThemedText>
                    )}
                    {trainingEvent.completedAt && (
                        <ThemedText>
                            Completed on{" "}
                            {format(trainingEvent.completedAt, "PPPPp")}
                        </ThemedText>
                    )}
                </ThemedView>
                <View style={styles.separator} />
            </Pressable>
        </ThemedView>
    );
};

const enhance = compose(
    withObservables(
        ["trainingEvent"],
        ({ trainingEvent }: TrainingEventListItemProps) => ({
            trainingEvent,
            village: trainingEvent.village,
            trainers: trainingEvent.trainers,
        })
    )
);

export default enhance(TrainingEventListItem);

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: "#aaa",
        marginVertical: 10,
    },
});
