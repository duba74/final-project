import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

type EventTimeOfDayPickerProps = {
    setEventTimeOfDay: (timeOfDay: string) => void;
};

const EventTimeOfDayPicker = ({
    setEventTimeOfDay,
}: EventTimeOfDayPickerProps) => {
    const [timeOfDay, setTimeOfDay] = useState<string>("AM");

    return (
        <Picker
            style={{ color: "#fff" }}
            selectedValue={timeOfDay}
            onValueChange={(itemValue, itemIndex) => {
                setTimeOfDay(itemValue);
                setEventTimeOfDay(itemValue);
            }}
        >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
        </Picker>
    );
};

export default EventTimeOfDayPicker;
