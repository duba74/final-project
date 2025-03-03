import {
    Pressable,
    Text,
    StyleSheet,
    type PressableProps,
    ViewStyle,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = PressableProps & {
    title: string;
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "cancel" | "danger";
};

const ThemedButton = ({
    title,
    onPress,
    style,
    lightColor,
    darkColor,
    type = "default",
    ...rest
}: ThemedButtonProps) => {
    const textColorDefault = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonText"
    );
    const textColorCancel = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonTextCancel"
    );
    const textColorDanger = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonTextDanger"
    );
    const backgroundColorDefault = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonBackground"
    );
    const backgroundColorCancel = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonBackgroundCancel"
    );
    const backgroundColorDanger = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonBackgroundDanger"
    );
    const pressedBackgroundColorDefault = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pressedButtonBackground"
    );
    const pressedBackgroundColorCancel = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pressedButtonBackgroundCancel"
    );
    const pressedBackgroundColorDanger = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pressedButtonBackgroundDanger"
    );
    const borderColorCancel = useThemeColor(
        { light: lightColor, dark: darkColor },
        "border"
    );

    let textColor;
    let backgroundColor;
    let pressedBackgroundColor;
    let borderColor;
    switch (type) {
        case "cancel":
            textColor = textColorCancel;
            backgroundColor = backgroundColorCancel;
            pressedBackgroundColor = pressedBackgroundColorCancel;
            borderColor = borderColorCancel;
            break;
        case "danger":
            textColor = textColorDanger;
            backgroundColor = backgroundColorDanger;
            pressedBackgroundColor = pressedBackgroundColorDanger;
            borderColor = undefined;
            break;
        default:
            textColor = textColorDefault;
            backgroundColor = backgroundColorDefault;
            pressedBackgroundColor = pressedBackgroundColorDefault;
            borderColor = undefined;
            break;
    }

    const pressableStyle = ({ pressed }: { pressed: boolean }): ViewStyle => ({
        backgroundColor: pressed ? pressedBackgroundColor : backgroundColor,
        borderColor: borderColor ? borderColor : undefined,
        borderWidth: borderColor ? 1 : undefined,
        ...styles.button,
        ...(style as Object),
    });

    return (
        <Pressable style={pressableStyle} onPress={onPress} {...rest}>
            <Text style={[styles.buttonText, { color: textColor }]}>
                {title}
            </Text>
        </Pressable>
    );
};

export default ThemedButton;

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
    },
});
