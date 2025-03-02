import { format } from "date-fns";
import ThemedText from "../themed/ThemedText";
import { View } from "react-native";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { withObservables } from "@nozbe/watermelondb/react";
import Village from "@/database/data-model/models/Village";

type EventVillageDescriptionProps = {
    trainingEvent: TrainingEvent;
    village: Village;
};

const EventVillageDescription = ({
    trainingEvent,
    village,
}: EventVillageDescriptionProps) => {
    return (
        <View>
            <ThemedText>{`${village.zoneName} - ${village.name}`}</ThemedText>
            <ThemedText>{`${format(trainingEvent.scheduledFor, "PPPP")} - ${
                trainingEvent.scheduledTime
            }`}</ThemedText>
        </View>
    );
};

const enhance = withObservables(
    ["trainingEvent"],
    ({ trainingEvent }: EventVillageDescriptionProps) => ({
        village: trainingEvent.village,
    })
);

export default enhance(EventVillageDescription);
