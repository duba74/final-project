import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useRouter } from "expo-router";
import TrainingEventList from "../training-event-list/TrainingEventList";

type VillageListItemProps = {
    village: Village;
};

const VillageListItem = ({ village }: VillageListItemProps) => {
    const router = useRouter();
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    };

    const handleAddEvent = () => {
        router.navigate({
            pathname: "./planner-event-modal",
            params: { village: village.id },
        });
    };

    return (
        <ThemedView>
            <ThemedText>{village.name}</ThemedText>
            <Pressable onPress={toggleExpanded}>
                <ThemedText>{isExpanded ? "▲" : "▼"}</ThemedText>
            </Pressable>
            {isExpanded && (
                <ThemedView>
                    <TrainingEventList village={village} />
                    <Pressable onPress={handleAddEvent}>
                        <ThemedText>Add Event</ThemedText>
                    </Pressable>
                </ThemedView>
            )}
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
