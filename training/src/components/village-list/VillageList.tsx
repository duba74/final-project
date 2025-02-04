import Village from "@/database/data-model/models/Village";
import { villageCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import { FlatList, StyleSheet } from "react-native";
import VillageListItem from "./VillageListItem";

const trainingEvents = [
    { id: "1", date: "121", time: "323", status: "not done" },
    { id: "2", date: "881", time: "029", status: "done" },
    { id: "3", date: "992", time: "838", status: "canceled" },
];

type VillageListProps = { villages: Village[] };

const VillageList = ({ villages }: VillageListProps) => {
    return (
        <FlatList
            data={villages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <VillageListItem
                    village={item}
                    trainingEvents={trainingEvents}
                />
            )}
        />
    );
};

const enhance = withObservables([], () => ({
    villages: villageCollection.query(),
}));

export default enhance(VillageList);

const styles = StyleSheet.create({});
