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
import Staff from "@/database/data-model/models/Staff";

type TrainingEventListItemProps = {
    trainingEvent: TrainingEvent;
    village: Village;
    trainers: Staff[];
};

const TrainingEventListItem = ({
    trainingEvent,
    village,
    trainers,
}: TrainingEventListItemProps) => {
    const router = useRouter();

    const handleModifyEvent = async () => {
        router.navigate({
            pathname: "/(app)/planner/planner-event-modal",
            params: { trainingEventId: trainingEvent.id },
        });
    };

    console.log(trainers);

    return (
        <ThemedView>
            <Pressable onPress={handleModifyEvent}>
                <ThemedView
                    style={{
                        gap: 15,
                        marginVertical: 10,
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <ThemedText>
                            {format(trainingEvent.scheduledFor, "PPPP")}
                            {", "}
                        </ThemedText>
                        <ThemedText>{trainingEvent.scheduledTime}</ThemedText>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <ThemedText>Created by: </ThemedText>
                        <ThemedText>{trainingEvent.createdBy}</ThemedText>
                    </View>
                    <ThemedText>
                        Trainer(s):{" "}
                        {trainers.length < 1
                            ? `No assigned trainer!`
                            : trainers
                                  .map(
                                      (trainer) =>
                                          `${trainer.firstName} ${trainer.lastName} - ${trainer.id}`
                                  )
                                  .join(", ")}
                    </ThemedText>
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
