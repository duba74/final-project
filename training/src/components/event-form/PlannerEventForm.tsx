import { View, Platform } from "react-native";
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
    const router = useRouter();
    const { session } = useSession();
    const [eventDate, setEventDate] = useState<Date>(defaultDate);
    const [eventTimeOfDay, setEventTimeOfDay] =
        useState<string>(defaultTimeOfDay);

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

    return (
        <ThemedView>
            <ThemedText>Event Form For Planner</ThemedText>
            <ThemedText>Training Module: {trainingModule?.name}</ThemedText>
            <ThemedText>Village: {village?.name}</ThemedText>
            {!trainingEvent &&
                (Platform.OS === "web" ? (
                    <>
                        <WebEventDatePicker
                            defaultDate={defaultDate}
                            setEventDate={setEventDate}
                        />
                        <EventTimeOfDayPicker
                            defaultTimeOfDay={defaultTimeOfDay}
                            setEventTimeOfDay={setEventTimeOfDay}
                        />
                        <ThemedButton
                            title="Create Event"
                            onPress={handleCreateEvent}
                        />
                    </>
                ) : (
                    <>
                        <EventDatePicker
                            defaultDate={defaultDate}
                            setEventDate={setEventDate}
                        />
                        <EventTimeOfDayPicker
                            defaultTimeOfDay={defaultTimeOfDay}
                            setEventTimeOfDay={setEventTimeOfDay}
                        />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginBottom: 20,
                            }}
                        >
                            <ThemedButton
                                title="Go Back"
                                type="cancel"
                                onPress={handleGoBack}
                            />
                            <ThemedButton
                                title="Create Event"
                                onPress={handleCreateEvent}
                            />
                        </View>
                    </>
                ))}
            {trainingEvent && (
                <>
                    <ThemedText>
                        Scheduled date:{" "}
                        {format(trainingEvent.scheduledFor, "PPPP")}
                    </ThemedText>
                    <ThemedText>
                        Scheduled time of day: {trainingEvent.scheduledTime}
                    </ThemedText>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginBottom: 20,
                        }}
                    >
                        <ThemedButton
                            title="Go Back"
                            type="cancel"
                            onPress={handleGoBack}
                        />
                        {!trainingEvent.isCompleted &&
                            trainingEvent.isDeletable && (
                                <ThemedButton
                                    title="Delete Event"
                                    type="danger"
                                    onPress={handleDeleteEvent}
                                />
                            )}
                        {!trainingEvent.isCompleted && (
                            <ThemedButton
                                title="Cancel Event"
                                onPress={handleCancelEvent}
                            />
                        )}
                    </View>
                </>
            )}
        </ThemedView>
    );
};

export default PlannerEventForm;
