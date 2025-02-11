import DateTimePicker from "@react-native-community/datetimepicker";
import {
    DateTimePickerAndroid,
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createElement, useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import ThemedText from "../themed/ThemedText";

type EventDatePickerProps = {
    setEventDate: (date: Date | undefined) => void;
};

const EventDatePicker = ({ setEventDate }: EventDatePickerProps) => {
    const [date, setDate] = useState<Date>();

    const onChange = (event: DateTimePickerEvent, date?: Date) => {
        setDate(date);
        setEventDate(date);
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
        return createElement("input", {
            type: "date",
            value: date,
            onInput: onChange,
        });
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
