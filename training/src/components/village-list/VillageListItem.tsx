import Village from "@/database/data-model/models/Village";
import { withObservables } from "@nozbe/watermelondb/react";
import { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import ThemedText from "../themed/ThemedText";
import { useRouter } from "expo-router";
import ThemedButton from "../themed/ThemedButton";
import { Q } from "@nozbe/watermelondb";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import { format, startOfToday } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTranslation } from "react-i18next";
import TrainingEventListItem from "../event-list/TrainingEventListItem";

const getNextEventDate = (trainingEvents: TrainingEvent[]) => {
    const today = startOfToday(); //.getTime();

    const futureEvents = trainingEvents.filter(
        (e) => e.scheduledFor >= today && !e.isCanceled
    );
    const pastEvents = trainingEvents.filter(
        (e) => e.scheduledFor < today && !e.isCanceled
    );

    const nextEventTime = Math.min(
        ...futureEvents.map((e) => e.scheduledFor.getTime())
    );
    const mostRecentEventTime = Math.max(
        ...pastEvents.map((e) => e.scheduledFor.getTime())
    );

    const nextEventDate = isFinite(nextEventTime)
        ? new Date(nextEventTime)
        : null;
    const mostRecentEventDate = isFinite(mostRecentEventTime)
        ? new Date(mostRecentEventTime)
        : null;

    return nextEventDate || mostRecentEventDate;
};

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
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [eventListHeight, setEventListHeight] = useState(0);
    const animationValue = useRef(new Animated.Value(0)).current;

    let locale;
    switch (i18n.language) {
        case "en":
            locale = enUS;
            break;

        case "fr":
            locale = fr;
            break;

        default:
            locale = enUS;
            break;
    }

    const villageListItemBackground = useThemeColor(
        { light: lightColor, dark: darkColor },
        "villageListItemBackground"
    );
    const shadowColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "shadowColor"
    );

    const styles = createStyles(villageListItemBackground, shadowColor);

    const nextEventDate = getNextEventDate(trainingEvents);

    const toggleExpanded = () => {
        if (isExpanded) {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setIsExpanded(false);
            });
        } else {
            setIsExpanded(true);
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleAddEvent = () => {
        router.navigate({
            pathname: "/(app)/planner/planner-event-modal",
            params: { villageId: village.id, currentModuleId: currentModule },
        });
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.villageContainer} onPress={toggleExpanded}>
                <View style={styles.villageComponents}>
                    <ThemedText style={styles.villageTitle} type="subtitle">
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
                                {format(nextEventDate, "PPPP", {
                                    locale: locale,
                                })}
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
            </Pressable>
            <Animated.View
                style={{
                    overflow: "hidden",
                    height: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, eventListHeight || 20],
                    }),
                }}
            >
                <View
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        if (height > 0) setEventListHeight(height);
                    }}
                >
                    {role !== "trainer" && (
                        <ThemedButton
                            title="Add Event"
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
            </Animated.View>
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
        villageTitle: {},
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
        addEventButton: {
            marginVertical: 10,
            alignSelf: "center",
            width: 160,
        },
    });
