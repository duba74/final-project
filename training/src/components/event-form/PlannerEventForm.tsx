import { View, Platform, StyleSheet } from "react-native";
import EventDatePicker from "./EventDatePicker";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import EventTimeOfDayPicker from "./EventTimeOfDayPicker";
import { useState } from "react";
import { addDays } from "date-fns";
import WebEventDatePicker from "./WebEventDatePicker";
import ThemedButton from "../themed/ThemedButton";
import { format, startOfDay, startOfToday } from "date-fns";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "expo-router";
import TrainingEvent from "@/database/data-model/models/TrainingEvent";
import Village from "@/database/data-model/models/Village";
import TrainingModule from "@/database/data-model/models/TrainingModule";
import { staffCollection } from "@/database/database";
import TrainingModuleIndicator from "../training-module-indicator/TrainingModuleIndicator";
import { useTranslation } from "react-i18next";
import { getLocalizedDateString } from "@/utils/localized-date";

const defaultDate = addDays(new Date(), 1);
const defaultTimeOfDay = "AM";

type PlannerEventFormProps = {
    village?: Village | null;
    trainingModule?: TrainingModule | null;
    trainingEvent?: TrainingEvent | null;
};

const PlannerEventForm = ({
    village,
    trainingModule,
    trainingEvent,
}: PlannerEventFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { session } = useSession();
    const [eventDate, setEventDate] = useState<Date>(defaultDate);
    const [eventTimeOfDay, setEventTimeOfDay] =
        useState<string>(defaultTimeOfDay);

    console.log(village);

    const handleCreateEvent = async () => {
        if (!village || !trainingModule) return;

        if (!session) {
            console.log("No session");
            return;
        }

        try {
            const user = JSON.parse(session).user;

            const staff = await staffCollection.find(user.username);

            const newTrainingEvent = await village.addTrainingEvent(
                trainingModule,
                format(eventDate, "yyyy-MM-dd"),
                eventTimeOfDay,
                staff
            );

            router.back();
        } catch (error) {
            console.error(`Failed to create event ${error}`);
        }
    };

    const handleCancelEvent = async () => {
        await trainingEvent?.toggleCancelEvent();
        router.back();
    };

    const handleDeleteEvent = async () => {
        await trainingEvent?.deleteEvent();
        router.back();
    };

    const handleToggleCompletion = async () => {
        await trainingEvent?.toggleCompleteEvent();
        router.back();
    };

    const handleGoBack = () => {
        router.back();
    };

    const getDatePicker = () => {
        if (Platform.OS === "web") {
            return (
                <WebEventDatePicker
                    defaultDate={defaultDate}
                    setEventDate={setEventDate}
                />
            );
        } else {
            return (
                <EventDatePicker
                    defaultDate={defaultDate}
                    setEventDate={setEventDate}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.moduleVillageInfoContainer}>
                <ThemedText style={styles.moduleVillageInfoText}>
                    {trainingModule?.name}
                </ThemedText>
                <ThemedText style={styles.moduleVillageInfoText}>
                    {village?.name}
                </ThemedText>
            </View>

            {!trainingEvent && (
                <View style={styles.eventInputsContainer}>
                    <View>
                        <ThemedText style={styles.eventInputsLabel}>
                            {t("plannerEventForm.eventDateSelectorLabel")}
                        </ThemedText>
                        {getDatePicker()}
                    </View>
                    <View>
                        <ThemedText style={styles.eventInputsLabel}>
                            {t("plannerEventForm.eventTimeOfDaySelectorLabel")}
                        </ThemedText>
                        <EventTimeOfDayPicker
                            defaultTimeOfDay={defaultTimeOfDay}
                            setEventTimeOfDay={setEventTimeOfDay}
                        />
                    </View>
                </View>
            )}
            {trainingEvent && (
                <View style={styles.eventInfoContainer}>
                    <View>
                        <ThemedText style={styles.eventInfo}>
                            {getLocalizedDateString(
                                trainingEvent.scheduledFor,
                                "PPPP"
                            )}
                        </ThemedText>
                        <ThemedText style={styles.eventInfoLabel}>
                            {t("plannerEventForm.eventDateLabel")}
                        </ThemedText>
                    </View>
                    <View>
                        <ThemedText style={styles.eventInfo}>
                            {trainingEvent.scheduledTime}
                        </ThemedText>
                        <ThemedText style={styles.eventInfoLabel}>
                            {t("plannerEventForm.eventTimeOfDayLabel")}
                        </ThemedText>
                    </View>
                    {trainingEvent.completedAt !== null && (
                        <View>
                            <ThemedText style={styles.eventInfo}>
                                {getLocalizedDateString(
                                    trainingEvent.completedAt,
                                    "PPPPp"
                                )}
                            </ThemedText>
                            <ThemedText style={styles.eventInfoLabel}>
                                {t("plannerEventForm.eventCompletionTimeLabel")}
                            </ThemedText>
                        </View>
                    )}
                </View>
            )}
            {!trainingEvent && (
                <View style={styles.buttonContainer}>
                    <ThemedButton
                        style={styles.button}
                        title={t("plannerEventForm.goBackButtonTitle")}
                        type="cancel"
                        onPress={handleGoBack}
                    />
                    <ThemedButton
                        style={styles.button}
                        title={t("plannerEventForm.createEventButtonTitle")}
                        onPress={handleCreateEvent}
                    />
                </View>
            )}
            {trainingEvent && (
                <View style={styles.buttonContainer}>
                    <ThemedButton
                        style={styles.button}
                        title={t("plannerEventForm.goBackButtonTitle")}
                        type="cancel"
                        onPress={handleGoBack}
                    />
                    {!trainingEvent.isCompleted &&
                        trainingEvent.isDeletable && (
                            <ThemedButton
                                style={styles.button}
                                title={t(
                                    "plannerEventForm.deleteEventButtonTitle"
                                )}
                                type="danger"
                                onPress={handleDeleteEvent}
                            />
                        )}
                    {!trainingEvent.isCompleted && (
                        <ThemedButton
                            style={styles.button}
                            title={t("plannerEventForm.cancelEventButtonTitle")}
                            onPress={handleCancelEvent}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

export default PlannerEventForm;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: "center",
        gap: 34,
    },
    moduleVillageInfoContainer: {
        alignItems: "center",
        gap: 10,
    },
    moduleVillageInfoText: {
        fontSize: 22,
    },
    eventInputsContainer: {
        width: "65%",
        gap: 28,
    },
    eventInputsLabel: {
        fontSize: 22,
        marginBottom: 4,
    },
    eventInfoContainer: {
        gap: 24,
    },
    eventInfo: {
        fontSize: 22,
    },
    eventInfoLabel: {
        fontStyle: "italic",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 20,
    },
    button: {
        width: 200,
    },
});
