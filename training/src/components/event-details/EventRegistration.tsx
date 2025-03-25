import ThemedButton from "@/components/themed/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextInput from "@/components/themed/ThemedTextInput";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { trainingEventCollection } from "@/database/database";
import EventDescription from "./EventDescription";
import {
    checkGpsLocationPermission,
    getGpsLocation,
    requestGpsLocationPermission,
} from "@/services/GpsService";
import { useTranslation } from "react-i18next";
import { getLocalizedDateString, replaceIsoDate } from "@/utils/localized-date";
import { useThemeColor } from "@/hooks/useThemeColor";
import EventCoordinates from "./EventCoordinates";

type EventRegistrationProps = {
    username: string;
    trainingEventId: string;
    trainingEvent: TrainingEvent;
    lightColor: string;
    darkColor: string;
};

const EventRegistration = ({
    username,
    trainingEventId,
    trainingEvent,
    lightColor,
    darkColor,
}: EventRegistrationProps) => {
    const { t } = useTranslation();
    const [commentText, setCommentText] = useState("");
    const [hasLocationPermission, setHasLocationPermission] = useState<
        boolean | null
    >(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const eventInfoBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "eventInfoBackground"
    );

    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
    );

    const styles = createStyles(eventInfoBackgroundColor, shadowColor);

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
            <EventCoordinates
                trainingEvent={trainingEvent}
                lightColor={lightColor}
                darkColor={darkColor}
            />
            <ThemedButton
                style={styles.button}
                title={t("eventRegistration.registrationButtonTitle")}
                onPress={handleRegisterEventCompletion}
            />

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

            <View style={{ gap: 10 }}>
                <ThemedTextInput
                    style={styles.commentsInput}
                    placeholder={t(
                        "eventRegistration.writeCommentsPlaceholder"
                    )}
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <ThemedButton
                    style={styles.button}
                    title="Save Comment"
                    onPress={handleSaveComment}
                />
                {trainingEvent.comments ? (
                    <ThemedText style={styles.commentsText}>
                        {replaceIsoDate(trainingEvent.comments, "PPPPp")}
                    </ThemedText>
                ) : (
                    <ThemedText style={styles.noCommentsText}>
                        {t("eventRegistration.noCommentsMessage")}
                    </ThemedText>
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

const createStyles = (eventInfoBackgroundColor: string, shadowColor: string) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
            gap: 20,
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
        commentsInput: {
            fontSize: 18,
            width: "85%",
            alignSelf: "center",
            borderWidth: 2,
            borderRadius: 6,
            marginTop: 30,
            paddingVertical: 6,
            paddingHorizontal: 10,
        },
        commentsText: {
            marginHorizontal: 20,
        },
        noCommentsText: {
            fontStyle: "italic",
            fontSize: 18,
            textAlign: "center",
        },
    });
