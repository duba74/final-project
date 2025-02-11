import { View, Text, Button } from "react-native";
import EventDatePicker from "./EventDatePicker";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import ThemedTextInput from "../themed/ThemedTextInput";
import EventTimeOfDayPicker from "./EventTimeOfDayPicker";
import { useState } from "react";

type PlannerEventFormProps = {
    village: string;
};

const PlannerEventForm = ({ village }: PlannerEventFormProps) => {
    const [eventDate, setEventDate] = useState<Date>();
    const [eventTimeOfDay, setEventTimeOfDay] = useState<string>();
    // Fetch the village data (name, country, etc.), just for labels
    // Get the assigned trainer
    // Get the module from context provider (still need to make this)
    // Get the user ID from the session for created_by

    const handleSubmit = () => {
        console.log(`Event date: ${eventDate}`);
        console.log(`Event time of day: ${eventTimeOfDay}`);
    };

    return (
        <ThemedView>
            <ThemedText>Event Form For Planner</ThemedText>
            <ThemedText>Village: {village}</ThemedText>
            <EventDatePicker setEventDate={setEventDate} />
            <EventTimeOfDayPicker setEventTimeOfDay={setEventTimeOfDay} />
            <Button title="Submit" onPress={handleSubmit} />
        </ThemedView>
    );
};

export default PlannerEventForm;
