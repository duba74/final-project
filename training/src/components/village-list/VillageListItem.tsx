import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useRouter } from "expo-router";
import TrainingEventList from "../training-event-list/TrainingEventList";
import ThemedButton from "../themed/ThemedButton";

type VillageListItemProps = {
    village: Village;
    currentModule: string;
};

const VillageListItem = ({ village, currentModule }: VillageListItemProps) => {
    const router = useRouter();
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    };

    const handleAddEvent = () => {
        router.navigate({
            pathname: "./planner-event-modal",
            params: { village: village.id, currentModule: currentModule },
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
                        <ThemedText type="subtitle">{village.name}</ThemedText>
                        <ThemedText>{isExpanded ? "▲" : "▼"}</ThemedText>
                    </ThemedView>
                </Pressable>
                {isExpanded && (
                    <ThemedView>
                        <TrainingEventList
                            village={village}
                            currentModule={currentModule}
                        />
                        <ThemedButton
                            title="Add Event"
                            style={{
                                marginVertical: 10,
                                alignSelf: "center",
                                width: 100,
                            }}
                            onPress={handleAddEvent}
                        />
                    </ThemedView>
                )}
            </ThemedView>
        </ThemedView>
    );
};

const enhance = withObservables(
    ["village"],
    ({ village }: VillageListItemProps) => ({
        village,
    })
);

export default enhance(VillageListItem);

const styles = StyleSheet.create({});
