import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";

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
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    };

    return (
        <View>
            <ThemedText>{village.name}</ThemedText>
            <Pressable onPress={toggleExpanded}>
                <ThemedText>{isExpanded ? "▲" : "▼"}</ThemedText>
            </Pressable>
            {isExpanded && (
                <View>
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
                </View>
            )}
        </View>
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
