import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

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
            <Text>{village.name}</Text>
            <Pressable onPress={toggleExpanded}>
                <Text>{isExpanded ? "▲" : "▼"}</Text>
            </Pressable>
            {isExpanded && (
                <View>
                    <Text>Training Events show here...</Text>
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
