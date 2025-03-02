import TrainingEventProvider from "@/context/TrainingEventContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

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
                    title: "Completion",
                    headerShown: false,
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
                name="event-participants"
                options={{
                    title: "Participants",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="group" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="participant-modal"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
