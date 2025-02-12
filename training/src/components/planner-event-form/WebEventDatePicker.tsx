import { useThemeColor } from "@/hooks/useThemeColor";
import { BaseSyntheticEvent, createElement, useEffect, useState } from "react";
import { format } from "date-fns";

type WebEventDatePickerProps = {
    lightColor?: string;
    darkColor?: string;
    defaultDate: Date;
    setEventDate: (date: Date) => void;
};

const WebEventDatePicker = ({
    lightColor,
    darkColor,
    defaultDate,
    setEventDate,
}: WebEventDatePickerProps) => {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );
    const [date, setDate] = useState<string>(format(defaultDate, "yyyy-MM-dd"));

    // useEffect(() => {
    //     setDate(format(defaultDate, "yyyy-MM-dd"));
    //     setEventDate(defaultDate);
    // }, [defaultDate]);

    const onChange = (e: BaseSyntheticEvent) => {
        setDate(e.target.value);
        setEventDate(new Date(e.target.value));
    };

    return createElement("input", {
        type: "date",
        value: date,
        onInput: onChange,
        style: {
            // colorScheme: webTheme,
            color: textColor,
            backgroundColor: backgroundColor,
        },
    });
};

export default WebEventDatePicker;
