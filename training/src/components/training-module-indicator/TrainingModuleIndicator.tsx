import TrainingModule from "@/database/data-model/models/TrainingModule";
import { trainingModuleCollection } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import ThemedText from "../themed/ThemedText";
import { StyleSheet } from "react-native";

type TrainingModuleIndicatorProps = {
    trainingModuleId: string;
    trainingModule: TrainingModule;
};

const TrainingModuleIndicator = ({
    trainingModuleId,
    trainingModule,
}: TrainingModuleIndicatorProps) => {
    return (
        <ThemedText type="subtitle" style={styles.indicatorText}>
            {trainingModule.name}
        </ThemedText>
    );
};

const enhance = withObservables(
    ["trainingModuleId"],
    ({ trainingModuleId }: TrainingModuleIndicatorProps) => ({
        trainingModule:
            trainingModuleCollection.findAndObserve(trainingModuleId),
    })
);

export default enhance(TrainingModuleIndicator);

const styles = StyleSheet.create({
    indicatorText: {
        marginVertical: 10,
    },
});
