import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import Village from "@/database/data-model/models/Village";
import { villageCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import { ObservableifyProps } from "@nozbe/watermelondb/react/withObservables";
import { FlatList, StyleSheet } from "react-native";
import TrainingEventListItem from "./TrainingEventListItem";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import { Q } from "@nozbe/watermelondb";

type TrainingEventListProps = {
    village: Village;
    currentModule: string;
    role: string;
    trainingEvents: TrainingEvent[];
};

const TrainingEventList = ({
    village,
    currentModule,
    role,
    trainingEvents,
}: TrainingEventListProps) => {
    return (
        <FlatList
            data={trainingEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TrainingEventListItem trainingEvent={item} role={role} />
            )}
        />
    );
};

const enhance = withObservables(
    ["village", "currentModule"],
    ({ village, currentModule }: TrainingEventListProps) => ({
        village,
        trainingEvents: village.trainingEvents.extend(
            Q.where("training_module", currentModule)
        ),
    })
);

export default enhance(TrainingEventList);

const styles = StyleSheet.create({});
