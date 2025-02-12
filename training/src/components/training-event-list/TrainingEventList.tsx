import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import Village from "@/database/data-model/models/Village";
import { villageCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import { ObservableifyProps } from "@nozbe/watermelondb/react/withObservables";
import { FlatList, StyleSheet } from "react-native";
import TrainingEventListItem from "./TrainingEventListItem";

type TrainingEventListProps = {
    village: Village;
    trainingEvents: TrainingEvent[];
};

const TrainingEventList = ({
    village,
    trainingEvents,
}: TrainingEventListProps) => {
    return (
        <FlatList
            data={trainingEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TrainingEventListItem trainingEvent={item} />
            )}
        />
    );
};

type InputProps = ObservableifyProps<TrainingEventListProps, "village">;
const enhance = withObservables(["village"], ({ village }: InputProps) => ({
    village,
    trainingEvents: village.trainingEvents,
}));

export default enhance(TrainingEventList);

const styles = StyleSheet.create({});
