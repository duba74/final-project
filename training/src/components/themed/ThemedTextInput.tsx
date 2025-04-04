import { TextInput, type TextInputProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

const ThemedTextInput = ({
    style,
    lightColor,
    darkColor,
    ...rest
}: ThemedTextInputProps) => {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "textInputBackground"
    );
    const borderColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "border"
    );

    return (
        <TextInput
            style={[{ color, borderColor, backgroundColor }, style]}
            placeholderTextColor={useThemeColor(
                { light: lightColor, dark: darkColor },
                "placeholderText"
            )}
            {...rest}
        />
    );
};

export default ThemedTextInput;
