import { useThemeColor } from "@/hooks/useThemeColor";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

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
    const [timeOfDay, setTimeOfDay] = useState<string>(defaultTimeOfDay);

    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pickerBackground"
    );
    const borderColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "border"
    );

    const styles = createStyles(textColor, backgroundColor, borderColor);

    useEffect(() => {
        setTimeOfDay(defaultTimeOfDay);
        setEventTimeOfDay(defaultTimeOfDay);
    }, [defaultTimeOfDay]);

    const handleValueChange = (itemValue: string, itemIndex: number) => {
        setTimeOfDay(itemValue);
        setEventTimeOfDay(itemValue);
    };

    return (
        <View style={[Platform.OS !== "web" && styles.pickerContainer]}>
            <Picker
                style={[
                    styles.picker,
                    Platform.OS === "web" && styles.pickerWeb,
                ]}
                itemStyle={{ borderRadius: 8 }}
                dropdownIconColor={textColor}
                selectedValue={timeOfDay}
                onValueChange={handleValueChange}
            >
                <Picker.Item label="AM" value="AM" />
                <Picker.Item label="PM" value="PM" />
            </Picker>
        </View>
    );
};

export default EventTimeOfDayPicker;

const createStyles = (
    textColor: string,
    backgroundColor: string,
    borderColor: string
) =>
    StyleSheet.create({
        pickerContainer: {
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 8,
            overflow: "hidden",
            color: textColor,
            backgroundColor: backgroundColor,
        },
        pickerWeb: {
            backgroundColor: backgroundColor,
        },
        picker: {
            color: textColor,
        },
    });
