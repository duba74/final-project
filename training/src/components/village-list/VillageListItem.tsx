import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useRouter } from "expo-router";
import TrainingEventList from "../event-list/TrainingEventList";
import ThemedButton from "../themed/ThemedButton";
import { Q } from "@nozbe/watermelondb";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format, startOfToday } from "date-fns";
import { useSession } from "@/hooks/useSession";

const getNextEventDate = (trainingEvents: TrainingEvent[]) => {
    const today = startOfToday(); //.getTime();

    const futureEvents = trainingEvents.filter(
        (e) => e.scheduledFor >= today && !e.isCanceled
    );
    const pastEvents = trainingEvents.filter(
        (e) => e.scheduledFor < today && !e.isCanceled
    );

    const nextEventTime = Math.min(
        ...futureEvents.map((e) => e.scheduledFor.getTime())
    );
    const mostRecentEventTime = Math.max(
        ...pastEvents.map((e) => e.scheduledFor.getTime())
    );

    const nextEventDate = isFinite(nextEventTime)
        ? new Date(nextEventTime)
        : null;
    const mostRecentEventDate = isFinite(mostRecentEventTime)
        ? new Date(mostRecentEventTime)
        : null;

    return nextEventDate || mostRecentEventDate;
};

type VillageListItemProps = {
    village: Village;
    trainingEvents: TrainingEvent[];
    currentModule: string;
    role: string;
    activeTrainingEventCount: number;
    canceledTrainingEventCount: number;
    completedTrainingEventCount: number;
};

const VillageListItem = ({
    village,
    currentModule,
    role,
    trainingEvents,
    activeTrainingEventCount,
    canceledTrainingEventCount,
    completedTrainingEventCount,
}: VillageListItemProps) => {
    const router = useRouter();
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const nextEventDate = getNextEventDate(trainingEvents);

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    };

    const handleAddEvent = () => {
        router.navigate({
            pathname: "/(app)/planner/planner-event-modal",
            params: { villageId: village.id, currentModuleId: currentModule },
        });
    };

    return (
        <ThemedView>
            <ThemedView style={{ marginBottom: 5 }}>
                <Pressable onPress={toggleExpanded}>
                    <ThemedView
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <ThemedText type="subtitle">
                                {village.name}
                            </ThemedText>
                            <View style={{ flexDirection: "row", gap: 15 }}>
                                <ThemedText>
                                    Active: {activeTrainingEventCount}
                                </ThemedText>
                                <ThemedText>
                                    Canceled: {canceledTrainingEventCount}
                                </ThemedText>
                                <ThemedText>
                                    Completed: {completedTrainingEventCount}
                                </ThemedText>
                            </View>

                            {nextEventDate && nextEventDate !== new Date(0) && (
                                <ThemedText>
                                    Next event date:{" "}
                                    {format(nextEventDate, "PPPP")}
                                </ThemedText>
                            )}
                        </View>
                        <ThemedText>{isExpanded ? "▲" : "▼"}</ThemedText>
                    </ThemedView>
                </Pressable>
                {isExpanded && (
                    <ThemedView>
                        <View style={styles.separator} />
                        <TrainingEventList
                            village={village}
                            currentModule={currentModule}
                            role={role}
                        />
                        {role !== "trainer" && (
                            <ThemedButton
                                title="Add Event"
                                style={{
                                    marginVertical: 10,
                                    alignSelf: "center",
                                    width: 100,
                                }}
                                onPress={handleAddEvent}
                            />
                        )}
                    </ThemedView>
                )}
            </ThemedView>
            <View style={styles.separator} />
        </ThemedView>
    );
};

const enhance = withObservables(
    ["village", "currentModule"],
    ({ village, currentModule }: VillageListItemProps) => ({
        village,
        trainingEvents: village.trainingEvents
            .extend(Q.where("training_module", currentModule))
            .observe(),
        activeTrainingEventCount: village.trainingEvents
            .extend(
                Q.where("training_module", currentModule),
                Q.where("is_canceled", Q.notEq(true))
            )
            .observeCount(),
        canceledTrainingEventCount: village.trainingEvents
            .extend(
                Q.where("training_module", currentModule),
                Q.where("is_canceled", true)
            )
            .observeCount(),
        completedTrainingEventCount: village.trainingEvents
            .extend(
                Q.where("training_module", currentModule),
                Q.where("completed_at", Q.notEq(null))
            )
            .observeCount(),
    })
);

export default enhance(VillageListItem);

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: "#aaa",
        marginVertical: 10,
    },
});
