import { View, Text } from "react-native";
import EventDatePicker from "./EventDatePicker";

type PlannerEventFormProps = {
    village: string;
};

const PlannerEventForm = ({ village }: PlannerEventFormProps) => {
    // Fetch the village data (name, country, etc.), just for labels
    // Get the assigned trainer
    // Get the module from context provider (still need to make this)
    // Get the user ID from the session for created_by

    return (
        <View>
            <Text>Event Form For Planner</Text>
            <Text>Village: {village}</Text>
            <EventDatePicker />
        </View>
    );
};

export default PlannerEventForm;
