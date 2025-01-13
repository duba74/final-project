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
};

const ThemedButton = ({
    title,
    onPress,
    style,
    lightColor,
    darkColor,
    ...rest
}: ThemedButtonProps) => {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonText"
    );
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "buttonBackground"
    );
    const pressedBackgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "pressedButtonBackground"
    );

    const pressableStyle = ({ pressed }: { pressed: boolean }): ViewStyle => ({
        backgroundColor: pressed ? pressedBackgroundColor : backgroundColor,
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
