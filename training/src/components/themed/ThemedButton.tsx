import {
    Pressable,
    Text,
    StyleSheet,
    type PressableProps,
    Animated,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRef } from "react";

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

    const animationValue = useRef(new Animated.Value(0)).current;

    const onPressIn = () => {
        Animated.timing(animationValue, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(animationValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
        }).start();
    };

    const animatedBackgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColor, pressedBackgroundColor],
    });

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
            {...rest}
        >
            <Animated.View
                style={[
                    styles.button,
                    { backgroundColor: animatedBackgroundColor },
                    borderColor ? { borderColor, borderWidth: 1 } : null,
                    style as Object,
                ]}
            >
                <Text style={[styles.buttonText, { color: textColor }]}>
                    {title}
                </Text>
            </Animated.View>
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
