import { useThemeColor } from "@/hooks/useThemeColor";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";

type EventTimeOfDayPickerProps = {
    lightColor?: string;
    darkColor?: string;
    defaultTimeOfDay: string;
    setEventTimeOfDay: (timeOfDay: string) => void;
};

const EventTimeOfDayPicker = ({
    lightColor,
    darkColor,
    defaultTimeOfDay,
    setEventTimeOfDay,
}: EventTimeOfDayPickerProps) => {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    const [timeOfDay, setTimeOfDay] = useState<string>(defaultTimeOfDay);

    useEffect(() => {
        setTimeOfDay(defaultTimeOfDay);
        setEventTimeOfDay(defaultTimeOfDay);
    }, [defaultTimeOfDay]);

    const handleValueChange = (itemValue: string, itemIndex: number) => {
        setTimeOfDay(itemValue);
        setEventTimeOfDay(itemValue);
    };

    return (
        <Picker
            style={{ color: textColor, backgroundColor: backgroundColor }}
            dropdownIconColor={textColor}
            selectedValue={timeOfDay}
            onValueChange={handleValueChange}
        >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
        </Picker>
    );
};

export default EventTimeOfDayPicker;
