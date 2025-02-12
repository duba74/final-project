import { View, Text, Platform } from "react-native";
import EventDatePicker from "./EventDatePicker";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import ThemedTextInput from "../themed/ThemedTextInput";
import EventTimeOfDayPicker from "./EventTimeOfDayPicker";
import { useState } from "react";
import { addDays } from "date-fns";
import WebEventDatePicker from "./WebEventDatePicker";
import ThemedButton from "../themed/ThemedButton";
import { villageCollection } from "@/database/database";
import { format } from "date-fns";
import { useSession } from "@/hooks/useSession";

const defaultDate = addDays(new Date(), 1);
const defaultTimeOfDay = "AM";

type PlannerEventFormProps = {
    village: string;
};

const PlannerEventForm = ({ village }: PlannerEventFormProps) => {
    const { session } = useSession();
    const [eventDate, setEventDate] = useState<Date>(defaultDate);
    const [eventTimeOfDay, setEventTimeOfDay] =
        useState<string>(defaultTimeOfDay);

    // Fetch the village data (name, country, etc.), just for labels
    // Get the assigned trainer
    // Get the module from context provider (still need to make this)
    // Get the user ID from the session for created_by

    const handleSubmit = async () => {
        console.log(`Event village: ${village}`);
        console.log(`Event date: ${eventDate}`);
        console.log(`Event time of day: ${eventTimeOfDay}`);

        if (!session) {
            console.log("No session");
            return;
        }

        try {
            const user = JSON.parse(session).user;
            console.log(user);

            const villageRecord = await villageCollection.find(village);
            const newTrainingEvent = await villageRecord.addTrainingEvent(
                "m1_ml",
                format(eventDate, "yyyy-MM-dd"),
                eventTimeOfDay,
                user.username
            );

            console.log(newTrainingEvent);
        } catch (error) {
            console.error(`Failed to create event ${error}`);
        }
    };

    return (
        <ThemedView>
            <ThemedText>Event Form For Planner</ThemedText>
            <ThemedText>Village: {village}</ThemedText>
            {Platform.OS === "web" ? (
                <WebEventDatePicker
                    defaultDate={defaultDate}
                    setEventDate={setEventDate}
                />
            ) : (
                <EventDatePicker
                    defaultDate={defaultDate}
                    setEventDate={setEventDate}
                />
            )}
            <EventTimeOfDayPicker
                defaultTimeOfDay={defaultTimeOfDay}
                setEventTimeOfDay={setEventTimeOfDay}
            />
            <ThemedButton title="Submit" onPress={handleSubmit} />
        </ThemedView>
    );
};

export default PlannerEventForm;
