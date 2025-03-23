import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import ThemedText from "../themed/ThemedText";
import { useRouter } from "expo-router";
import ThemedButton from "../themed/ThemedButton";
import { Q } from "@nozbe/watermelondb";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import TrainingEventListItem from "../event-list/TrainingEventListItem";
import { getLocalizedDateString } from "@/utils/localized-date";
import { getNextEventDate } from "@/utils/next-event";

type VillageListItemProps = {
    village: Village;
    trainingEvents: TrainingEvent[];
    currentModule: string;
    role: string;
    activeTrainingEventCount: number;
    canceledTrainingEventCount: number;
    completedTrainingEventCount: number;
    lightColor: string;
    darkColor: string;
};

const VillageListItem = ({
    village,
    currentModule,
    role,
    trainingEvents,
    activeTrainingEventCount,
    canceledTrainingEventCount,
    completedTrainingEventCount,
    lightColor,
    darkColor,
}: VillageListItemProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [nextEventDate, setNextEventDate] = useState<Date | undefined>();
    const backgroundAnimationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const nextDate = getNextEventDate(trainingEvents);
        if (nextDate) setNextEventDate(nextDate);
    }, [trainingEvents]);

    const villageListItemBackground = useThemeColor(
        { light: lightColor, dark: darkColor },
        "villageListItemBackground"
    );
    const villageListItemBackgroundPressed = useThemeColor(
        { light: lightColor, dark: darkColor },
        "villageListItemBackgroundPressed"
    );
    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
    );

    const onPressIn = () => {
        Animated.timing(backgroundAnimationValue, {
            toValue: 1,
            duration: 80,
            useNativeDriver: false,
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(backgroundAnimationValue, {
            toValue: 0,
            duration: 80,
            useNativeDriver: false,
        }).start();
    };

    const backgroundColor = backgroundAnimationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
            villageListItemBackground,
            villageListItemBackgroundPressed,
        ],
    });

    const styles = createStyles(villageListItemBackground, shadowColor);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddEvent = () => {
        router.navigate({
            pathname: "/(app)/planner/planner-event-modal",
            params: { villageId: village.id, currentModuleId: currentModule },
        });
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={toggleExpanded}
            >
                <Animated.View
                    style={[styles.villageContainer, { backgroundColor }]}
                >
                    <View style={styles.villageComponents}>
                        <ThemedText type="subtitle">
                            {village.name} - {village.zoneName}
                        </ThemedText>
                        <View style={styles.statusIndicatorsContainer}>
                            <View>
                                <ThemedText style={styles.counterNumber}>
                                    {activeTrainingEventCount}
                                </ThemedText>
                                <ThemedText style={styles.villageInfoLabel}>
                                    {t("villageList.scheduledEventNumberLabel")}
                                </ThemedText>
                            </View>
                            <View>
                                <ThemedText style={styles.counterNumber}>
                                    {completedTrainingEventCount}
                                </ThemedText>
                                <ThemedText style={styles.villageInfoLabel}>
                                    {t("villageList.completedEventNumberLabel")}
                                </ThemedText>
                            </View>
                            <View>
                                <ThemedText style={styles.counterNumber}>
                                    {canceledTrainingEventCount}
                                </ThemedText>
                                <ThemedText style={styles.villageInfoLabel}>
                                    {t("villageList.canceledEventNumberLabel")}
                                </ThemedText>
                            </View>
                        </View>

                        {nextEventDate && nextEventDate !== new Date(0) && (
                            <View>
                                <ThemedText style={styles.nextEventDate}>
                                    {getLocalizedDateString(
                                        nextEventDate,
                                        "PPPP"
                                    )}
                                </ThemedText>
                                <ThemedText style={styles.villageInfoLabel}>
                                    {t("villageList.nextEventDateLabel")}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                    <ThemedText style={styles.villageExpanderArrow}>
                        {isExpanded ? "▲" : "▼"}
                    </ThemedText>
                </Animated.View>
            </Pressable>
            {isExpanded && (
                <View style={styles.trainingEventsContainer}>
                    {role !== "trainer" && (
                        <ThemedButton
                            title={t("villageList.addEventButtonTitle")}
                            style={styles.addEventButton}
                            onPress={handleAddEvent}
                        />
                    )}
                    {trainingEvents.map((trainingEvent, i) => {
                        return (
                            <TrainingEventListItem
                                key={i}
                                trainingEvent={trainingEvent}
                                role={role}
                            />
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const enhance = withObservables(
    ["village", "currentModule"],
    ({ village, currentModule }: VillageListItemProps) => ({
        village,
        trainingEvents: village.trainingEvents
            .extend(Q.where("training_module", currentModule))
            .observe(),
        activeTrainingEventCount: village.trainingEvents
            .extend(
                Q.where("training_module", currentModule),
                Q.where("is_canceled", Q.notEq(true))
            )
            .observeCount(),
        canceledTrainingEventCount: village.trainingEvents
            .extend(
                Q.where("training_module", currentModule),
                Q.where("is_canceled", true)
            )
            .observeCount(),
        completedTrainingEventCount: village.trainingEvents
            .extend(
                Q.where("training_module", currentModule),
                Q.where("completed_at", Q.notEq(null))
            )
            .observeCount(),
    })
);

export default enhance(VillageListItem);

const createStyles = (villageListItemBackground: string, shadowColor: string) =>
    StyleSheet.create({
        container: {
            marginBottom: 18,
            alignItems: "stretch",
        },
        villageContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 8,
            paddingVertical: 10,
            backgroundColor: villageListItemBackground,
            borderRadius: 10,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
        },
        villageComponents: {
            flex: 1,
            gap: 12,
        },
        statusIndicatorsContainer: {
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 16,
        },
        counterNumber: {
            fontSize: 22,
        },
        villageInfoLabel: {
            fontSize: 16,
            fontStyle: "italic",
        },
        nextEventDate: {
            fontSize: 20,
        },
        villageExpanderArrow: {
            alignSelf: "center",
            fontSize: 18,
        },
        trainingEventsContainer: {
            marginVertical: 15,
            gap: 12,
            // alignItems: "center",
        },
        addEventButton: {
            alignSelf: "center",
            width: 160,
        },
    });
