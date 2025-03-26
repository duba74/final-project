import DateTimePicker from "@react-native-community/datetimepicker";
import {
    DateTimePickerAndroid,
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createElement, useEffect, useState } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text /*useColorScheme*/,
} from "react-native";
import ThemedText from "../themed/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { format } from "date-fns";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
    const iconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "iconColor"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pickerBackground"
    );
    const borderColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "border"
    );

    const styles = createStyles(backgroundColor, borderColor);

    const [date, setDate] = useState<Date | undefined>(defaultDate);

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
            <Pressable
                style={styles.androidDatePicker}
                onPress={showDatepicker}
            >
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
                <MaterialCommunityIcons
                    size={20}
                    name="calendar-blank"
                    color={iconColor}
                />
            </Pressable>
        );
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

const createStyles = (backgroundColor: string, borderColor: string) =>
    StyleSheet.create({
        androidDatePicker: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 16,
        },
    });
