import { useThemeColor } from "@/hooks/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs, useSegments } from "expo-router";

type TrainerTabLayoutProps = {
    lightColor: string;
    darkColor: string;
};

export default function TrainerTabLayout({
    lightColor,
    darkColor,
}: TrainerTabLayoutProps) {
    const tabIconColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconDefault"
    );
    const tabIconSelectedColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "tabIconSelected"
    );
    const segments = useSegments();
    const hide = segments.includes("[trainingEventId]" as never);

    return (
        <Tabs
            screenOptions={{
                tabBarInactiveTintColor: tabIconColor,
                tabBarActiveTintColor: tabIconSelectedColor,
                tabBarStyle: {
                    display: hide ? "none" : "flex",
                },
            }}
        >
            <Tabs.Screen
                name="villages"
                options={{
                    title: "Villages",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            size={28}
                            name="home-group"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="operations"
                options={{
                    title: "Trainer Operations",
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="cog" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="[trainingEventId]"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
