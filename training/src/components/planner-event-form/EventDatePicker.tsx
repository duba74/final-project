import DateTimePicker from "@react-native-community/datetimepicker";
import {
    DateTimePickerAndroid,
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createElement, useState } from "react";
import { Platform, Pressable, Text } from "react-native";

const EventDatePicker = () => {
    const [eventDate, setEventDate] = useState<Date>();

    const onChange = (event: DateTimePickerEvent, date?: Date) => {
        setEventDate(date);
    };

    if (Platform.OS === "android") {
        const showDatepicker = () => {
            DateTimePickerAndroid.open({
                value: eventDate ? eventDate : new Date(),
                onChange,
                mode: "date",
                is24Hour: false,
            });
        };

        return (
            <Pressable onPress={showDatepicker}>
                <Text>
                    {eventDate?.toLocaleDateString([], {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                    })}
                </Text>
            </Pressable>
        );
    } else if (Platform.OS === "web") {
        return createElement("input", {
            type: "date",
            value: eventDate,
            onInput: onChange,
        });
    } else {
        return (
            <DateTimePicker
                testID="dateTimePicker"
                value={eventDate ? eventDate : new Date()}
                mode="date"
                onChange={onChange}
            />
        );
    }
};

export default EventDatePicker;
