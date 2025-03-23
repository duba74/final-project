import { withObservables } from "@nozbe/watermelondb/react";
import { Animated, View, StyleSheet, Pressable } from "react-native";
import ThemedText from "../themed/ThemedText";
import { Href, useRouter } from "expo-router";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format } from "date-fns";
import Village from "@/database/data-model/models/Village";
import Staff from "@/database/data-model/models/Staff";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRef } from "react";
import { getLocalizedDateString } from "@/utils/localized-date";
import { useTranslation } from "react-i18next";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type TrainingEventListItemProps = {
    role: string;
    trainingEvent: TrainingEvent;
    createdBy: Staff;
    village: Village;
    trainers: Staff[];
    lightColor: string;
    darkColor: string;
};

const TrainingEventListItem = ({
    role,
    trainingEvent,
    createdBy,
    trainers,
    lightColor,
    darkColor,
}: TrainingEventListItemProps) => {
    const { t } = useTranslation();
    const router = useRouter();

    const handleModifyEvent = async () => {
        if (role === "trainer") {
            const path =
                `/(app)/trainer/(home)/${trainingEvent.id}/event-registration` as Href;
            router.navigate(path);
        } else if (role === "planner") {
            router.navigate({
                pathname: "/(app)/planner/planner-event-modal",
                params: { trainingEventId: trainingEvent.id },
            });
        }
    };

    const trainingEventBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "trainingEventListItemBackground"
    );
    const trainingEventBackgroundPressedColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "trainingEventListItemBackgroundPressed"
    );
    const canceledEventBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "canceledEventListItemBackground"
    );
    const canceledEventBackgroundPressedColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "canceledEventListItemBackgroundPressed"
    );
    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
    );
    const canceldEventIconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "canceledEventIcon"
    );
    const completedEventIconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "completedEventIcon"
    );

    const animationValue = useRef(new Animated.Value(0)).current;

    const onPressIn = () => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(animationValue, {
            toValue: 0,
            duration: 180,
            useNativeDriver: false,
        }).start();
    };

    const eventBackgroundColor = trainingEvent.isCanceled
        ? canceledEventBackgroundColor
        : trainingEventBackgroundColor;
    const eventBackgroundColorPressed = trainingEvent.isCanceled
        ? canceledEventBackgroundPressedColor
        : trainingEventBackgroundPressedColor;

    const backgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [eventBackgroundColor, eventBackgroundColorPressed],
    });

    const styles = createStyles(shadowColor);

    const getStatusIcon = (trainingEvent: TrainingEvent) => {
        if (trainingEvent.completedAt)
            return (
                <FontAwesome
                    size={28}
                    name="check-circle"
                    color={completedEventIconColor}
                />
            );

        if (trainingEvent.isCanceled)
            return (
                <MaterialCommunityIcons
                    size={28}
                    name="close-circle"
                    color={canceldEventIconColor}
                />
            );
    };

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handleModifyEvent}
        >
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <View style={styles.dateAndStatusIconContainer}>
                    <ThemedText style={styles.eventDate}>
                        {`${getLocalizedDateString(
                            trainingEvent.scheduledFor,
                            "PPPP"
                        )}, ${trainingEvent.scheduledTime}`}
                    </ThemedText>
                    <View style={styles.statusIconContainer}>
                        {getStatusIcon(trainingEvent)}
                    </View>
                </View>
                <View style={styles.personnelInfoContainer}>
                    <View style={styles.personnelInfo}>
                        <ThemedText>{`${createdBy.firstName} ${createdBy.lastName}`}</ThemedText>
                        <ThemedText style={styles.personnelInfoLabelText}>
                            {t("trainingEventList.eventCreatorLabel")}
                        </ThemedText>
                    </View>
                    <View style={styles.personnelInfo}>
                        <ThemedText>
                            {trainers.length < 1
                                ? `No assigned trainer!`
                                : trainers
                                      .map(
                                          (trainer) =>
                                              `${trainer.firstName} ${trainer.lastName}`
                                      )
                                      .join(", ")}
                        </ThemedText>
                        <ThemedText style={styles.personnelInfoLabelText}>
                            {t("trainingEventList.eventTrainerLabel")}
                        </ThemedText>
                    </View>
                </View>
                {trainingEvent.isCanceled && (
                    <ThemedText style={styles.canceledText}>
                        {t("trainingEventList.eventCanceledLabel")}
                    </ThemedText>
                )}

                {trainingEvent.completedAt && (
                    <View style={styles.completedInfo}>
                        <ThemedText style={styles.eventDate}>
                            {getLocalizedDateString(
                                trainingEvent.completedAt,
                                "PPPPp"
                            )}
                        </ThemedText>
                        <ThemedText style={styles.completedInfoLabelText}>
                            {t("trainingEventList.completedDateLabel")}
                        </ThemedText>
                    </View>
                )}
            </Animated.View>
        </Pressable>
    );
};

const enhance = withObservables(
    ["trainingEvent"],
    ({ trainingEvent }: TrainingEventListItemProps) => ({
        trainingEvent,
        createdBy: trainingEvent.createdBy,
        trainers: trainingEvent.trainers,
    })
);

export default enhance(TrainingEventListItem);

const createStyles = (shadowColor: string) =>
    StyleSheet.create({
        container: {
            alignSelf: "center",
            gap: 10,
            width: "90%",
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 8,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
        },
        dateAndStatusIconContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        statusIconContainer: {
            justifyContent: "center",
            alignItems: "center",
        },
        eventDate: {
            flex: 1,
            fontSize: 20,
        },
        personnelInfoContainer: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: 15,
        },
        personnelInfo: {
            flex: 1,
        },
        personnelInfoLabelText: {
            fontStyle: "italic",
        },
        canceledText: {
            fontSize: 20,
            fontStyle: "italic",
        },
        completedInfo: {},
        completedInfoLabelText: {
            fontStyle: "italic",
        },
    });
