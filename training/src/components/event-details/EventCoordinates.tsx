import ThemedText from "../themed/ThemedText";
import { StyleSheet, View } from "react-native";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/useThemeColor";

type EventCoordinatesProps = {
    trainingEvent: TrainingEvent;
    lightColor?: string;
    darkColor?: string;
};

const EventCoordinates = ({
    trainingEvent,
    lightColor,
    darkColor,
}: EventCoordinatesProps) => {
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
                    {JSON.parse(trainingEvent.location)?.latitude
                        ? JSON.parse(trainingEvent.location)
                              .latitude.toString()
                              .slice(0, 9)
                        : "---"}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventRegistration.latitudeLabel")}
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.infoText}>
                    {JSON.parse(trainingEvent.location)?.longitude
                        ? JSON.parse(trainingEvent.location)
                              .longitude.toString()
                              .slice(0, 9)
                        : "---"}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventRegistration.longitudeLabel")}
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.infoText}>
                    {JSON.parse(trainingEvent.location)?.altitude
                        ? JSON.parse(trainingEvent.location)
                              .altitude.toString()
                              .slice(0, 9)
                        : "---"}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventRegistration.altitudeLabel")}
                </ThemedText>
            </View>
            <View>
                <ThemedText style={styles.infoText}>
                    {JSON.parse(trainingEvent.location)?.accuracy
                        ? JSON.parse(trainingEvent.location)
                              .accuracy.toString()
                              .slice(0, 9)
                        : "---"}
                </ThemedText>
                <ThemedText style={styles.infoLabel}>
                    {t("eventRegistration.accuracyLabel")}
                </ThemedText>
            </View>
        </View>
    );
};

export default EventCoordinates;

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
