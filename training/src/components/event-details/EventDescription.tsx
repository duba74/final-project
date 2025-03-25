import ThemedText from "../themed/ThemedText";
import { StyleSheet, View } from "react-native";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { withObservables } from "@nozbe/watermelondb/react";
import Village from "@/database/data-model/models/Village";
import TrainingModule from "@/database/data-model/models/TrainingModule";
import { getLocalizedDateString } from "@/utils/localized-date";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";

type EventDescriptionProps = {
    trainingEvent: TrainingEvent;
    village: Village;
    trainingModule: TrainingModule;
    lightColor: string;
    darkColor: string;
};

const EventDescription = ({
    trainingEvent,
    village,
    trainingModule,
    lightColor,
    darkColor,
}: EventDescriptionProps) => {
    const { t } = useTranslation();

    const eventInfoBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "eventInfoBackground"
    );

    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
    );

    const styles = createStyles(eventInfoBackgroundColor, shadowColor);

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
            <View>
                <ThemedText style={styles.infoText}>
                    {trainingEvent.completedAt
                        ? getLocalizedDateString(
                              trainingEvent.completedAt,
                              "PPPPp"
                          )
                        : "---"}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventDescription.eventCompletionTimeLabel")}
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

const createStyles = (eventInfoBackgroundColor: string, shadowColor: string) =>
    StyleSheet.create({
        infoContainer: {
            alignSelf: "center",
            alignItems: "flex-start",
            width: "90%",
            marginHorizontal: 16,
            marginBottom: 24,
            gap: 10,
            backgroundColor: eventInfoBackgroundColor,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 10,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
        },
        infoText: {
            fontSize: 22,
        },
        infoLabel: {
            fontStyle: "italic",
        },
    });
