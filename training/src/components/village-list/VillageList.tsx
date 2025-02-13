import Village from "@/database/data-model/models/Village";
import { villageCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import { FlatList, StyleSheet } from "react-native";
import VillageListItem from "./VillageListItem";

type VillageListProps = { villages: Village[]; currentModule: string };

const VillageList = ({ villages, currentModule }: VillageListProps) => {
    return (
        <FlatList
            style={{ width: "85%" }}
            data={villages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <VillageListItem village={item} currentModule={currentModule} />
            )}
        />
    );
};

const enhance = withObservables([], () => ({
    villages: villageCollection.query(),
}));

export default enhance(VillageList);

const styles = StyleSheet.create({});
