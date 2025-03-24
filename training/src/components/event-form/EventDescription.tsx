import { format } from "date-fns";
import ThemedText from "../themed/ThemedText";
import { StyleSheet, View } from "react-native";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { withObservables } from "@nozbe/watermelondb/react";
import Village from "@/database/data-model/models/Village";
import TrainingModule from "@/database/data-model/models/TrainingModule";
import { getLocalizedDateString } from "@/utils/localized-date";
import { useTranslation } from "react-i18next";

type EventDescriptionProps = {
    trainingEvent: TrainingEvent;
    village: Village;
    trainingModule: TrainingModule;
};

const EventDescription = ({
    trainingEvent,
    village,
    trainingModule,
}: EventDescriptionProps) => {
    const { t } = useTranslation();

    return (
        <View style={styles.infoContainer}>
            <View>
                <ThemedText style={styles.infoText}>
                    {trainingModule.name}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventDescription.eventModuleLabel")}
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.infoText}>
                    {`${village.name} - ${village.zoneName}`}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventDescription.eventVillageLabel")}
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.infoText}>
                    {getLocalizedDateString(trainingEvent.scheduledFor, "PPPP")}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventDescription.eventDateLabel")}
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.infoText}>
                    {trainingEvent.scheduledTime}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventDescription.eventTimeOfDayLabel")}
                </ThemedText>
            </View>
        </View>
    );
};

const enhance = withObservables(
    ["trainingEvent"],
    ({ trainingEvent }: EventDescriptionProps) => ({
        village: trainingEvent.village,
        trainingModule: trainingEvent.trainingModule,
    })
);

export default enhance(EventDescription);

const styles = StyleSheet.create({
    infoContainer: {
        alignSelf: "center",
        alignItems: "flex-start",
        marginHorizontal: 16,
        marginBottom: 24,
        gap: 10,
    },
    infoText: {
        fontSize: 22,
    },
    infoLabel: {
        fontStyle: "italic",
    },
});
