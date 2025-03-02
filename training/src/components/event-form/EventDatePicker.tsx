import DateTimePicker from "@react-native-community/datetimepicker";
import {
    DateTimePickerAndroid,
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createElement, useEffect, useState } from "react";
import { Platform, Pressable, Text /*useColorScheme*/ } from "react-native";
import ThemedText from "../themed/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format } from "date-fns";

type EventDatePickerProps = {
    lightColor?: string;
    darkColor?: string;
    defaultDate: Date | undefined;
    setEventDate: (date: Date) => void;
};

const EventDatePicker = ({
    lightColor,
    darkColor,
    defaultDate,
    setEventDate,
}: EventDatePickerProps) => {
    // const webTheme = useColorScheme() ?? "light";
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    const [date, setDate] = useState<Date | undefined>(defaultDate);

    // useEffect(() => {
    //     setDate(defaultDate);
    //     // setEventDate(defaultDate);
    // }, [defaultDate]);

    const onChange = (event: DateTimePickerEvent, date?: Date) => {
        setDate(date);
        if (date) setEventDate(date);
    };

    if (Platform.OS === "android") {
        const showDatepicker = () => {
            DateTimePickerAndroid.open({
                value: date ? date : new Date(),
                onChange,
                mode: "date",
                is24Hour: false,
            });
        };

        return (
            <Pressable onPress={showDatepicker}>
                <ThemedText>
                    {date
                        ? date.toLocaleDateString([], {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "2-digit",
                          })
                        : "Select a date"}
                </ThemedText>
            </Pressable>
        );
    } else if (Platform.OS === "web") {
    } else {
        return (
            <DateTimePicker
                testID="dateTimePicker"
                value={date ? date : new Date()}
                mode="date"
                onChange={onChange}
            />
        );
    }
};

export default EventDatePicker;
