import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";

type TabBarIconProps = {
    IconComponent: any;
    iconName: string;
    iconSize?: number;
    focused: boolean;
    title: string;
    lightColor: string;
    darkColor: string;
};

const TabBarIcon = ({
    IconComponent,
    iconName,
    iconSize = 28,
    focused,
    title,
    lightColor,
    darkColor,
}: TabBarIconProps) => {
    const tabIconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconDefault"
    );
    const tabIconSelectedColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconSelected"
    );
    const tabBoxColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabBoxColor"
    );

    return (
        <View
            style={[
                styles.iconContainer,
                focused && { backgroundColor: tabBoxColor },
            ]}
        >
            <IconComponent
                size={iconSize}
                name={iconName}
                color={focused ? tabIconSelectedColor : tabIconColor}
            />
            <Text
                style={[
                    styles.iconText,
                    {
                        color: focused ? tabIconSelectedColor : tabIconColor,
                    },
                ]}
            >
                {title}
            </Text>
        </View>
    );
};

export default TabBarIcon;

const styles = StyleSheet.create({
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        width: 75,
        height: 40,
        backgroundColor: "transparent",
    },
    iconText: {
        fontSize: 10,
        textAlign: "center",
    },
});
