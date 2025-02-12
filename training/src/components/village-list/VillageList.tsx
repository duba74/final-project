import Village from "@/database/data-model/models/Village";
import { villageCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import { FlatList, StyleSheet } from "react-native";
import VillageListItem from "./VillageListItem";

type VillageListProps = { villages: Village[] };

const VillageList = ({ villages }: VillageListProps) => {
    return (
        <FlatList
            data={villages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VillageListItem village={item} />}
        />
    );
};

const enhance = withObservables([], () => ({
    villages: villageCollection.query(),
}));

export default enhance(VillageList);

const styles = StyleSheet.create({});
