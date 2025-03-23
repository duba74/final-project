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

    const trainingEventListItemBackground = useThemeColor(
        { light: lightColor, dark: darkColor },
        "trainingEventListItemBackground"
    );
    const trainingEventListItemBackgroundPressed = useThemeColor(
        { light: lightColor, dark: darkColor },
        "trainingEventListItemBackgroundPressed"
    );
    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
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

    const backgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
            trainingEventListItemBackground,
            trainingEventListItemBackgroundPressed,
        ],
    });

    const styles = createStyles(shadowColor);

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handleModifyEvent}
        >
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <ThemedText style={styles.eventDate}>
                    {`${getLocalizedDateString(
                        trainingEvent.scheduledFor,
                        "PPPP"
                    )}, ${trainingEvent.scheduledTime}`}
                </ThemedText>
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
                {trainingEvent.isCanceled && <ThemedText>Canceled!</ThemedText>}

                {trainingEvent.completedAt && (
                    <View style={styles.completedInfo}>
                        <ThemedText style={styles.eventDate}>
                            {getLocalizedDateString(
                                trainingEvent.completedAt,
                                "PPPPp"
                            )}
                        </ThemedText>
                        <ThemedText>
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
        eventDate: {
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
        completedInfo: {},
    });
