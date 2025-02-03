import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { View, Text, StyleSheet } from "react-native";

type VillageListItemProps = { village: Village };

const VillageListItem = ({ village }: VillageListItemProps) => {
    return (
        <View>
            <Text>{village.name}</Text>
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
