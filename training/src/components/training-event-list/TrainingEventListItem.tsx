import { compose, withObservables } from "@nozbe/watermelondb/react";
import { View, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { Href, useRouter } from "expo-router";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format } from "date-fns";
import Village from "@/database/data-model/models/Village";
import Staff from "@/database/data-model/models/Staff";

type TrainingEventListItemProps = {
    role: string;
    trainingEvent: TrainingEvent;
    createdBy: Staff;
    village: Village;
    trainers: Staff[];
};

const TrainingEventListItem = ({
    role,
    trainingEvent,
    createdBy,
    village,
    trainers,
}: TrainingEventListItemProps) => {
    const router = useRouter();

    const handleModifyEvent = async () => {
        if (role === "trainer") {
            // NOW WHAT? Should go to a new tabs screen? Tabs on top? Maybe start with just links. Where there's a tab for each operation needed
            // Get coords, capture date. capture photo, capture particpant list photo, register participants
            // Also have tab to go back to villages
            // router.navigate(`/(app)/trainer/(home)/${trainingEvent.id}/event-completion`)
            const path =
                `/(app)/trainer/(home)/${trainingEvent.id}/event-completion` as Href;
            router.navigate(path);
        } else if (role === "planner") {
            router.navigate({
                pathname: "/(app)/planner/planner-event-modal",
                params: { trainingEventId: trainingEvent.id },
            });
        }
    };

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
                        <ThemedText>{`${createdBy.firstName} ${createdBy.lastName} - ${createdBy.id}`}</ThemedText>
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
            createdBy: trainingEvent.createdBy,
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
