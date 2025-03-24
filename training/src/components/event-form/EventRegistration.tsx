import ThemedButton from "@/components/themed/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import ThemedView from "@/components/themed/ThemedView";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { format } from "date-fns";
import { trainingEventCollection } from "@/database/database";
import EventDescription from "./EventDescription";
import {
    checkGpsLocationPermission,
    getGpsLocation,
    requestGpsLocationPermission,
} from "@/services/GpsService";
import { useTranslation } from "react-i18next";
import { getLocalizedDateString } from "@/utils/localized-date";

type EventRegistrationProps = {
    username: string;
    trainingEventId: string;
    trainingEvent: TrainingEvent;
};

const EventRegistration = ({
    username,
    trainingEventId,
    trainingEvent,
}: EventRegistrationProps) => {
    const { t } = useTranslation();
    const [commentText, setCommentText] = useState("");
    const [hasLocationPermission, setHasLocationPermission] = useState<
        boolean | null
    >(null);
    const [locationLoading, setLocationLoading] = useState(false);

    useEffect(() => {
        const checkGpsPermission = async () => {
            const permisson = await checkGpsLocationPermission();

            setHasLocationPermission(permisson);
        };
        checkGpsPermission();
    }, []);

    const handleRegisterEventCompletion = async () => {
        if (!hasLocationPermission) {
            const permission = await requestGpsLocationPermission();
            setHasLocationPermission(permission);
            if (!permission) return;
        }

        setLocationLoading(true);
        const location = await getGpsLocation();
        setLocationLoading(false);

        trainingEvent.registerCompletionTime(location.timestamp);
        trainingEvent.registerLocation(JSON.stringify(location.coords));
    };

    const handleSaveComment = () => {
        trainingEvent.appendToComments(commentText, username);
        setCommentText("");
    };

    return (
        <View style={styles.container}>
            <EventDescription trainingEvent={trainingEvent} />
            <ThemedButton
                style={styles.button}
                title={t("eventRegistration.registrationButtonTitle")}
                onPress={handleRegisterEventCompletion}
            />
            <View style={styles.registrationInfoContainer}>
                {!hasLocationPermission && (
                    <View style={styles.gpsStatusContainer}>
                        <ThemedText style={styles.gpsStatusText}>
                            {t(
                                "eventRegistration.locationPermissionNotGrantedMessage"
                            )}
                        </ThemedText>
                    </View>
                )}
                {locationLoading && (
                    <View style={styles.gpsStatusContainer}>
                        <ActivityIndicator size="large" />
                        <ThemedText style={styles.gpsStatusText}>
                            {t("eventRegistration.capturingCoordinatesMessage")}
                        </ThemedText>
                    </View>
                )}
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
                        {t("eventRegistration.eventTimeOfCompletionLabel")}
                    </ThemedText>
                </View>
                <View>
                    <ThemedText style={styles.infoText}>
                        {JSON.parse(trainingEvent.location).latitude
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
                        {JSON.parse(trainingEvent.location).longitude
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
                        {JSON.parse(trainingEvent.location).altitude
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
                        {JSON.parse(trainingEvent.location).accuracy
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
            <View style={{ gap: 10 }}>
                <ThemedText>Add Comment</ThemedText>
                <ThemedTextInput
                    placeholder="Write comments here"
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <ThemedButton
                    title="Save Comment"
                    onPress={handleSaveComment}
                />
                {trainingEvent.comments ? (
                    <ThemedText>{trainingEvent.comments}</ThemedText>
                ) : (
                    <ThemedText>No comments recorded</ThemedText>
                )}
            </View>
        </View>
    );
};

const enhance = withObservables(
    ["trainingEventId"],
    ({ trainingEventId }: EventRegistrationProps) => ({
        trainingEvent: trainingEventCollection.findAndObserve(trainingEventId),
    })
);

export default enhance(EventRegistration);

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        gap: 30,
    },
    button: {
        alignSelf: "center",
        width: 340,
    },
    registrationInfoContainer: {
        alignSelf: "center",
        alignItems: "flex-start",
        marginHorizontal: 16,
        gap: 10,
    },
    gpsStatusContainer: {
        alignSelf: "center",
        marginBottom: 10,
    },
    gpsStatusText: {
        textAlign: "center",
        marginHorizontal: 16,
        fontSize: 18,
    },
    infoText: {
        fontSize: 22,
    },
    infoLabel: {
        fontStyle: "italic",
    },
});
