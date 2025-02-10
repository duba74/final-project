import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import ThemedView from "../themed/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";

type trainingEvent = {
    id: string;
    date: string;
    time: string;
    status: string;
};
type VillageListItemProps = {
    village: Village;
    trainingEvents: trainingEvent[];
};

const VillageListItem = ({ village, trainingEvents }: VillageListItemProps) => {
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
                    <ThemedText>Training Events show here...</ThemedText>
                    {/* {trainingEvents.length > 0 ? (
                        trainingEvents.map((event) => (
                            <View key={event.id} >
                                <Text>Date: {event.date}</Text>
                                <Text>Time: {event.time}</Text>
                                <Text>Status: {event.status}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>No training events available</Text>
                    )} */}
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
