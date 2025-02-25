import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Text } from "react-native";

type TrainerEventTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function TrainerEventTabLayout({
    lightColor,
    darkColor,
}: TrainerEventTabLayoutProps) {
    const tabIconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconDefault"
    );
    const tabIconSelectedColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconSelected"
    );

    return (
        <Tabs
            screenOptions={{
                tabBarInactiveTintColor: tabIconColor,
                tabBarActiveTintColor: tabIconSelectedColor,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="event-completion"
                options={{
                    title: "Event Completion",
                    // headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome
                            size={28}
                            name="check-circle"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="participants"
                options={{
                    title: "Event Participants",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="group" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
