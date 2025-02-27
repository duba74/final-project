import { View, Platform } from "react-native";
import EventDatePicker from "./EventDatePicker";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import EventTimeOfDayPicker from "./EventTimeOfDayPicker";
import { useState } from "react";
import { addDays } from "date-fns";
import WebEventDatePicker from "./WebEventDatePicker";
import ThemedButton from "../themed/ThemedButton";
import { format } from "date-fns";
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

    // Fetch the village data (name, country, etc.), just for labels
    // Get the assigned trainer
    // Get the module from context provider (still need to make this)
    // Get the user ID from the session for created_by

    const handleCreateEvent = async () => {
        console.log(`Training module: ${trainingModule?.name}`);
        console.log(`Event village: ${village?.name}`);
        console.log(`Event date: ${eventDate}`);
        console.log(`Event time of day: ${eventTimeOfDay}`);

        if (!village || !trainingModule) return;

        if (!session) {
            console.log("No session");
            return;
        }

        try {
            const user = JSON.parse(session).user;
            console.log(user);

            const staff = await staffCollection.find(user.username);

            const newTrainingEvent = await village.addTrainingEvent(
                trainingModule,
                format(eventDate, "yyyy-MM-dd"),
                eventTimeOfDay,
                staff
            );

            console.log(newTrainingEvent);

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
                        <ThemedButton
                            title="Create Event"
                            onPress={handleCreateEvent}
                        />
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
                    <ThemedButton
                        title="Cancel Event"
                        onPress={handleCancelEvent}
                    />
                    <ThemedButton
                        title="Delete Event"
                        onPress={handleDeleteEvent}
                    />
                    <ThemedButton
                        title="Toggle Completion"
                        onPress={handleToggleCompletion}
                    />
                </>
            )}
            <ThemedButton title="Go Back" onPress={handleGoBack} />
        </ThemedView>
    );
};

export default PlannerEventForm;
